import type { Request } from 'express';
import type { QueryResult, QueryResultRow } from 'pg';

export interface Db {
  query<T extends QueryResultRow = any>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
  asUser(req: Request): Db;
}
