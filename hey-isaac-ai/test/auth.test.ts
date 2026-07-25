import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { extractOboIdentity } from '../server/middleware/auth';

describe('extractOboIdentity', () => {
  it('should extract email from x-forwarded-access-token JWT sub claim', () => {
    // Simulated JWT (not a real token) with sub: "user@example.com"
    // Format: header.payload.signature where payload = {sub:"user@example.com"}
    const token = 'FAKE.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.FAKE';
    const req = {
      headers: { 'x-forwarded-access-token': token },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('user@example.com');
  });

  it('should lowercase extracted email from x-forwarded-access-token', () => {
    // Simulated JWT with sub: "USER@EXAMPLE.COM" (uppercase)
    const token = 'FAKE.eyJzdWIiOiJVU0VSQEVYQk1QTEUuQ09NIn0.FAKE';
    const req = {
      headers: { 'x-forwarded-access-token': token },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('user@exbmple.com');
  });

  it('should skip JWT with non-email sub claim', () => {
    // Simulated JWT with numeric sub: "1234567890"
    const token = 'FAKE.eyJzdWIiOiIxMjM0NTY3ODkwIn0.FAKE';
    const req = {
      headers: {
        'x-forwarded-access-token': token,
        'x-forwarded-email': 'email@example.com',
      },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('email@example.com');
  });

  it('should use x-forwarded-email as first fallback', () => {
    const req = {
      headers: { 'x-forwarded-email': 'user@example.com' },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('user@example.com');
  });

  it('should lowercase x-forwarded-email', () => {
    const req = {
      headers: { 'x-forwarded-email': 'USER@EXAMPLE.COM' },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('user@example.com');
  });

  it('should skip numeric x-forwarded-user and use x-forwarded-email', () => {
    const req = {
      headers: {
        'x-forwarded-user': '1234567890@1234567890',
        'x-forwarded-email': 'user@example.com',
      },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('user@example.com');
  });

  it('should use x-forwarded-user if not numeric', () => {
    const req = {
      headers: { 'x-forwarded-user': 'username@example.com' },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('username@example.com');
  });

  it('should use x-databricks-user-email as fallback', () => {
    const req = {
      headers: { 'x-databricks-user-email': 'databricks@example.com' },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('databricks@example.com');
  });

  it('should use x-ms-client-principal-name as last fallback', () => {
    const req = {
      headers: { 'x-ms-client-principal-name': 'aad@example.com' },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBe('aad@example.com');
  });

  it('should return null when no identity headers are present', () => {
    const req = { headers: {} } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBeNull();
  });

  it('should return null when headers are empty strings', () => {
    const req = {
      headers: {
        'x-forwarded-email': '',
        'x-forwarded-user': '',
        'x-databricks-user-email': '',
        'x-ms-client-principal-name': '',
      },
    } as unknown as Request;

    const result = extractOboIdentity(req);
    expect(result).toBeNull();
  });
});
