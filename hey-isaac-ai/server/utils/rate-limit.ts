import type { Request, Response } from 'express';

export function databricksRealIpKeyGenerator(req: Request, _res: Response): string {
  const fallbackIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const realIp = req.headers['x-real-ip'];
  if (Array.isArray(realIp)) {
    return realIp[0] || fallbackIp;
  }
  return realIp || fallbackIp;
}
