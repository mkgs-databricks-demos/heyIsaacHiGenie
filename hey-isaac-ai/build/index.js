import express, { Router } from "express";
import { createApp, lakebase, server } from "@databricks/appkit";
import { SignJWT, jwtVerify } from "jose";
import rateLimit from "express-rate-limit";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { randomUUID } from "crypto";
import { randomUUID as randomUUID$1 } from "node:crypto";

//#region server/middleware/auth.ts
const OBO_HEADER_CANDIDATES = [
	"x-forwarded-user",
	"x-databricks-user-email",
	"x-ms-client-principal-name"
];
function extractOboIdentity(req) {
	for (const header of OBO_HEADER_CANDIDATES) {
		const val = req.headers[header];
		if (typeof val === "string" && val.length > 0) return val;
	}
	return null;
}
async function verifyPersonaToken(token, issuer) {
	const key = process.env.HI_GENIE_JWT_SIGNING_KEY;
	if (!key) return null;
	try {
		const secret = new TextEncoder().encode(key);
		const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || "mcp";
		const { payload } = await jwtVerify(token, secret, {
			issuer,
			audience
		});
		const { sub, persona, project_id, jti } = payload;
		if (typeof sub !== "string" || typeof persona !== "string" || typeof project_id !== "string" || typeof jti !== "string" || jti.length === 0) return null;
		return {
			sub,
			persona,
			project_id
		};
	} catch {
		return null;
	}
}
async function authMiddleware(req, res, next) {
	const human = extractOboIdentity(req);
	if (!human) {
		res.status(401).json({
			error: "unauthenticated",
			message: "No OBO identity in request headers"
		});
		return;
	}
	const ctx = { human };
	const personaToken = req.headers["x-persona-token"];
	if (typeof personaToken === "string") {
		const issuer = process.env.HI_GENIE_PERSONA_ISSUER;
		if (issuer) {
			const claims = await verifyPersonaToken(personaToken, issuer);
			if (claims && claims.sub === human) {
				ctx.persona = claims.persona;
				ctx.project_id = claims.project_id;
			}
		}
	}
	req.ctx = ctx;
	next();
}

//#endregion
//#region server/routes/mcp.ts
const limiter$2 = rateLimit({
	windowMs: 15 * 60 * 1e3,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false
});
function buildMcpServer(human, persona, project_id) {
	const server$1 = new McpServer({
		name: "hi-genie",
		version: "0.1.0"
	});
	server$1.tool("whoami", "Return the authenticated identity for this MCP session (human + persona)", {}, async () => ({ content: [{
		type: "text",
		text: JSON.stringify({
			human,
			persona: persona ?? null,
			project_id: project_id ?? null
		}, null, 2)
	}] }));
	server$1.tool("ping", "Echo a message back — basic health check", { message: z.string().optional().describe("Optional message to echo") }, async ({ message }) => ({ content: [{
		type: "text",
		text: message ?? "pong"
	}] }));
	return server$1;
}
function mcpRouter() {
	const router = Router();
	router.post("/", limiter$2, authMiddleware, async (req, res) => {
		const { human, persona, project_id } = req.ctx;
		const server$1 = buildMcpServer(human, persona, project_id);
		const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
		res.on("close", () => {
			transport.close().catch(() => void 0);
		});
		await server$1.connect(transport);
		await transport.handleRequest(req, res, req.body);
	});
	return router;
}

//#endregion
//#region server/routes/dcr.ts
const limiter$1 = rateLimit({
	windowMs: 15 * 60 * 1e3,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false
});
const registry = new Map();
function dcrRouter() {
	const router = Router();
	router.post("/", limiter$1, (req, res) => {
		const configured = process.env.HI_GENIE_DCR_SHARED_SECRET;
		const provided = req.header("x-dcr-shared-secret");
		if (!configured || provided !== configured) {
			res.status(401).json({ error: "unauthorized" });
			return;
		}
		const { client_name, redirect_uris = [], grant_types = ["authorization_code"],...rest } = req.body;
		if (typeof client_name !== "string" || !client_name) {
			res.status(400).json({
				error: "invalid_client_metadata",
				error_description: "client_name is required"
			});
			return;
		}
		const client_id = `hg_${randomUUID().replace(/-/g, "").slice(0, 20)}`;
		const client_secret = randomUUID().replace(/-/g, "");
		const client_id_issued_at = Math.floor(Date.now() / 1e3);
		registry.set(client_id, {
			client_secret,
			metadata: {
				client_name,
				redirect_uris,
				grant_types,
				...rest
			}
		});
		if (process.env.NODE_ENV === "development") console.log(`[dcr] registered client: ${client_id} (${client_name})`);
		res.status(201).json({
			client_id,
			client_secret,
			client_id_issued_at,
			client_secret_expires_at: 0,
			client_name,
			redirect_uris,
			grant_types
		});
	});
	router.get("/:client_id", limiter$1, (req, res) => {
		const entry = registry.get(req.params.client_id);
		if (!entry) {
			res.status(404).json({ error: "not_found" });
			return;
		}
		res.json({
			client_id: req.params.client_id,
			...entry.metadata
		});
	});
	return router;
}

//#endregion
//#region server/routes/persona-token.ts
const limiter = rateLimit({
	windowMs: 15 * 60 * 1e3,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false
});
const IssueSchema = z.object({
	persona: z.string().min(1).describe("Agent nickname (e.g. \"Isaac\", \"Genie\")"),
	project_id: z.string().min(1).describe("Project identifier")
});
function personaTokenRouter() {
	const router = Router();
	router.post("/persona", limiter, async (req, res) => {
		const human = extractOboIdentity(req);
		if (!human) {
			res.status(401).json({
				error: "unauthenticated",
				message: "OBO identity required — authenticate via Databricks before issuing a persona token"
			});
			return;
		}
		const parsed = IssueSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				error: "invalid_request",
				details: parsed.error.flatten()
			});
			return;
		}
		const key = process.env.HI_GENIE_JWT_SIGNING_KEY;
		if (!key) {
			res.status(503).json({
				error: "not_configured",
				message: "Persona token signing key not available — set HI_GENIE_JWT_SIGNING_KEY"
			});
			return;
		}
		const { persona, project_id } = parsed.data;
		const secret = new TextEncoder().encode(key);
		const issuer = process.env.HI_GENIE_PERSONA_ISSUER || "";
		if (!issuer) {
			res.status(503).json({
				error: "not_configured",
				message: "Persona token issuer not configured — set HI_GENIE_PERSONA_ISSUER"
			});
			return;
		}
		const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || "mcp";
		const jti = randomUUID$1();
		const token = await new SignJWT({
			sub: human,
			persona,
			project_id
		}).setProtectedHeader({ alg: "HS256" }).setJti(jti).setAudience(audience).setIssuedAt().setExpirationTime("1h").setIssuer(issuer).sign(secret);
		if (process.env.NODE_ENV === "development") console.log(`[persona-token] issued: human=${human} persona=${persona} project=${project_id}`);
		res.json({
			token,
			token_type: "Bearer",
			expires_in: 3600,
			persona,
			project_id
		});
	});
	return router;
}

//#endregion
//#region server/routes/well-known.ts
function wellKnownRouter() {
	const router = Router();
	router.get("/oauth-authorization-server", (_req, res) => {
		const appUrl = (process.env.HI_GENIE_APP_URL || "").replace(/\/$/, "");
		if (!appUrl) {
			res.status(503).json({
				error: "not_configured",
				message: "OAuth authorization server issuer not configured — set HI_GENIE_APP_URL"
			});
			return;
		}
		res.json({
			issuer: appUrl,
			registration_endpoint: `${appUrl}/register`,
			response_types_supported: ["code"],
			grant_types_supported: ["authorization_code"]
		});
	});
	return router;
}

//#endregion
//#region server/server.ts
if (!process.env.HI_GENIE_JWT_SIGNING_KEY) if (process.env.NODE_ENV === "development") console.warn("[auth] HI_GENIE_JWT_SIGNING_KEY not set — persona tokens will fail. Set it in server/.env");
else throw new Error("HI_GENIE_JWT_SIGNING_KEY is required");
const AppKit = await createApp({
	plugins: [server(), lakebase()],
	async onPluginsReady(appkit) {
		appkit.server.extend((app) => {
			app.use(express.json());
			app.use("/mcp", mcpRouter());
			app.use("/register", dcrRouter());
			app.use("/.well-known", wellKnownRouter());
			app.use("/token", personaTokenRouter());
			app.get("/api/me", (req, res) => {
				const human = extractOboIdentity(req);
				if (!human) {
					res.status(401).json({ error: "unauthenticated" });
					return;
				}
				res.json({
					email: human,
					oboHeaders: Object.fromEntries([
						"x-forwarded-user",
						"x-databricks-user-email",
						"x-ms-client-principal-name"
					].filter((h) => req.headers[h]).map((h) => [h, req.headers[h]]))
				});
			});
			app.get("/health", (_req, res) => res.json({
				status: "ok",
				ts: new Date().toISOString()
			}));
		});
	}
});

//#endregion
export { AppKit };