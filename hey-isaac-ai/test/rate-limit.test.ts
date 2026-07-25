import { describe, it, expect } from 'vitest';
import type { Request, Response } from 'express';
import { databricksRealIpKeyGenerator } from '../server/utils/rate-limit';

describe('databricksRealIpKeyGenerator', () => {
  it('should extract IP from x-real-ip header when present', () => {
    const req = {
      headers: { 'x-real-ip': '192.168.1.1' },
      ip: '10.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('192.168.1.1');
  });

  it('should handle x-real-ip as array and return first element', () => {
    const req = {
      headers: { 'x-real-ip': ['203.0.113.1', '203.0.113.2'] },
      ip: '10.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('203.0.113.1');
  });

  it('should fallback to req.ip when x-real-ip is not present', () => {
    const req = {
      headers: {},
      ip: '10.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('10.0.0.1');
  });

  it('should fallback to socket.remoteAddress when req.ip is null', () => {
    const req = {
      headers: {},
      ip: null,
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('127.0.0.1');
  });

  it('should return "unknown" when all sources are unavailable', () => {
    const req = {
      headers: {},
      ip: null,
      socket: { remoteAddress: null },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('unknown');
  });

  it('should handle empty x-real-ip array and fallback to req.ip', () => {
    const req = {
      headers: { 'x-real-ip': [] },
      ip: '10.0.0.2',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as Request;

    const result = databricksRealIpKeyGenerator(req, {} as Response);
    expect(result).toBe('10.0.0.2');
  });
});
