import express from 'express';
import { SERVER_INFO } from '../constants';

export function createHealthCheckApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', ts: new Date().toISOString() });
  });

  app.get('/info', (_req, res) => {
    res.json(SERVER_INFO);
  });

  return app;
}
