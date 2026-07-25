import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createHealthCheckApp } from '../server/_internal/testables';

describe('Health Check Routes', () => {
  it('should respond with status ok on /health', async () => {
    const app = createHealthCheckApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('ts');
    expect(typeof response.body.ts).toBe('string');
  });

  it('should return ISO timestamp on /health', async () => {
    const app = createHealthCheckApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    // Verify it's a valid ISO timestamp
    const timestamp = new Date(response.body.ts);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });

  it('should return server info on /info', async () => {
    const app = createHealthCheckApp();

    const response = await request(app).get('/info');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'hi-genie');
    expect(response.body).toHaveProperty('version', '0.1.0');
  });

  it('should respond with JSON content-type', async () => {
    const app = createHealthCheckApp();

    const response = await request(app).get('/health');

    expect(response.type).toBe('application/json');
  });
});
