import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { discovery, randomState, randomNonce, authorizationCodeGrant, buildAuthorizationUrl } from 'openid-client';
import { loadConfig } from './config.js';

const config = loadConfig();

const app = express();
app.set('trust proxy', true);
app.use(cors({ origin: config.webBaseUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/healthz', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptimeSeconds: Math.round(process.uptime()) });
});

// Minimal stub endpoints for UX wiring
app.get('/api/auth/providers', (_req: Request, res: Response) => {
  res.json({ providers: ['google', 'microsoft', 'icloud'] });
});

app.post('/api/auth/connect', (req: Request, res: Response) => {
  const { provider, icalUrl } = req.body ?? {};
  if (!provider || !['google', 'microsoft', 'icloud'].includes(provider)) {
    return res.status(400).json({ error: 'Unsupported provider' });
  }
  if (provider === 'icloud' && (!icalUrl || typeof icalUrl !== 'string')) {
    return res.status(400).json({ error: 'iCal URL required for iCloud' });
  }
  // In real impl: redirect to OAuth or validate iCal URL; here we just acknowledge
  return res.json({ ok: true, provider });
});

// In-memory token store for dev
const sessionStore = new Map<string, { provider: 'google' | 'microsoft'; tokens: any }>();
function getSessionId(req: Request, res: Response): string {
  let sid = req.cookies['sid'];
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 18);
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
  }
  return sid;
}

app.get('/api/auth/:provider/start', async (req: Request, res: Response) => {
  const provider = req.params.provider as 'google' | 'microsoft';
  
  if (provider !== 'google') {
    return res.status(400).json({ error: 'Only Google OAuth is implemented' });
  }
  
  if (!config.google.clientId || !config.google.clientSecret) {
    return res.status(500).json({ error: 'Google OAuth not configured - check .env file' });
  }
  
  const sid = getSessionId(req, res);
  const state = randomState();
  const nonce = randomNonce();
  
  res.cookie('oauth_state', state, { httpOnly: true, sameSite: 'lax' });
  res.cookie('oauth_nonce', nonce, { httpOnly: true, sameSite: 'lax' });
  
  // Build Google OAuth URL and redirect to Google (NOT back to your site!)
  const authUrl = `https://accounts.google.com/oauth2/auth?` +
    `client_id=${encodeURIComponent(config.google.clientId)}&` +
    `redirect_uri=${encodeURIComponent(config.google.redirectUri || 'http://localhost:4001/api/auth/google/callback')}&` +
    `scope=${encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events')}&` +
    `response_type=code&` +
    `state=${state}&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  sessionStore.set(`${sid}:intent`, { provider, tokens: {} } as any);
  console.log('Redirecting to Google OAuth:', authUrl);
  res.redirect(authUrl);
});

app.get('/api/auth/:provider/callback', async (req: Request, res: Response) => {
  const provider = req.params.provider as 'google' | 'microsoft';
  const sid = getSessionId(req, res);
  // Simplified callback for demo
  sessionStore.set(sid, { provider, tokens: { access_token: 'demo-token' } });
  res.clearCookie('oauth_state');
  res.clearCookie('oauth_nonce');
  res.redirect(config.webBaseUrl);
});

app.get('/api/auth/status', (req: Request, res: Response) => {
  const sid = req.cookies['sid'];
  const s = sid ? sessionStore.get(sid) : undefined;
  res.json({ connected: Boolean(s), provider: s?.provider });
});

app.post('/api/availability', (req: Request, res: Response) => {
  // In real impl: validate link token + invitee source; compute slots
  const now = new Date();
  const s1 = new Date(now.getTime() + 15 * 60 * 1000);
  const e1 = new Date(s1.getTime() + 30 * 60 * 1000);
  const s2 = new Date(e1.getTime() + 30 * 60 * 1000);
  const e2 = new Date(s2.getTime() + 30 * 60 * 1000);
  return res.json({
    slots: [
      { start: s1.toISOString(), end: e1.toISOString() },
      { start: s2.toISOString(), end: e2.toISOString() }
    ]
  });
});

app.post('/api/book', (req: Request, res: Response) => {
  const { slot } = req.body ?? {};
  if (!slot?.start || !slot?.end) {
    return res.status(400).json({ error: 'Invalid slot' });
  }
  return res.json({ ok: true, bookingId: 'stub-' + Date.now() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Avoid leaking details in prod
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ error: message });
});

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${config.port}`);
});

server.on('error', (err: unknown) => {
  if (err && typeof err === 'object' && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`Port ${config.port} is already in use. Set PORT to a free port or stop the other process.`);
  } else {
    // eslint-disable-next-line no-console
    console.error('Server error', err);
  }
  process.exit(1);
});

const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`${signal} received, shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));


