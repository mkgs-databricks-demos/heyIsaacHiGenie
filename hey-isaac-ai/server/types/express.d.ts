declare namespace Express {
  interface Request {
    user?: string;    // human email (lower-cased)
    persona?: string; // agent nickname
    agentId?: string; // agent UUID
  }
}
