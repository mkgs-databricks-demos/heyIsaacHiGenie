import pg from 'pg';

// AppKit's lakebase() plugin config accepts `pool.options` (e.g.
// '-c search_path=app,public') but @databricks/lakebase's parsePoolConfig()
// (pool-config.js) never reads or forwards that field into the pg.PoolConfig
// it builds — it's silently dropped before pg.Pool ever sees it, for both the
// SP pool and every per-user OBO pool. Confirmed live: a fresh connection
// defaults to `search_path = "$user", public`, so any unqualified query
// against a table in the `app` schema (e.g. `SELECT * FROM project_members`)
// throws `relation "project_members" does not exist` and — since these are
// unhandled rejections deep in route handlers — crashes the whole process.
//
// AppKit exposes no connect-hook on the pools it creates (RoutingPool has no
// event surface, and the underlying pg.Pool instances are private plugin
// fields), so the only reliable fix from application code is to intercept
// pg.Pool itself before @databricks/lakebase constructs any pool with it.
// `pg` is a singleton CJS module (single `pg` install, verified via
// `node -e "require('pg').Pool === require('pg').Pool"`), so mutating the
// shared `Pool` export here is visible to @databricks/lakebase's own
// `import pg from 'pg'` — including pools created later, lazily, per OBO user.
//
// Must run before AppKit's lakebase() plugin setup() (i.e. before
// createApp()) so every pool it constructs — SP and OBO alike — inherits the
// patched constructor.
let installed = false;

export function installLakebaseSearchPath(schema = 'app, public'): void {
  if (installed) return;
  installed = true;

  const OriginalPool = pg.Pool;

  class SearchPathPool extends OriginalPool {
    constructor(config?: pg.PoolConfig) {
      super({
        ...config,
        // pg-pool (see newClient() in pg-pool/index.js) awaits this hook
        // and only proceeds to hand the client to any pool.connect()/
        // pool.query() caller if it resolves. If it rejects, pg-pool ends
        // the client, drops it from its internal client list, and rejects
        // the *pending acquisition* with our error — so a connection whose
        // search_path we failed to set is never handed to a query, instead
        // of silently running unqualified queries against the wrong schema
        // (which is exactly how the original bug crashed the process).
        // This is the correct/only pg-pool lifecycle hook for this: unlike
        // a 'connect' event listener (fire-and-forget, no way to stop the
        // client being used), onConnect is awaited before acquisition.
        onConnect: async (client: pg.PoolClient) => {
          try {
            await client.query(`SET search_path TO ${schema}`);
          } catch (err) {
            console.error('[db] failed to set search_path on new Lakebase connection — rejecting this connection:', err);
            throw err;
          }
        },
      } as pg.PoolConfig);
    }
  }

  (pg as unknown as { Pool: typeof pg.Pool }).Pool = SearchPathPool as unknown as typeof pg.Pool;
}
