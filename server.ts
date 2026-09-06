import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { privacySafe } from './src/security';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_JSON_BYTES = '256kb';
app.use(express.json({ limit: MAX_JSON_BYTES }));

async function nebius(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  const key = process.env.NEBIUS_API_KEY?.trim();
  if (!key) throw new Error('NEBIUS_API_KEY is not configured');
  const base = (process.env.NEBIUS_BASE_URL || 'https://api.studio.nebius.ai/v1').replace(/\/+$/, '');
  const model = process.env.NEBIUS_MODEL || 'nvidia/Llama-3.1-Nemotron-70B-Instruct';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 1200 }),
    });
    if (!response.ok) throw new Error(`Nebius returned ${response.status}`);
    const data: any = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Malformed AI response');
    return { content, model: data?.model || model };
  } finally {
    clearTimeout(timer);
  }
}

function fallback(metadata: any) {
  const score = Number(metadata?.securityScore ?? 50);
  const weak = Number(metadata?.weakCount ?? 0);
  const reused = Number(metadata?.reusedCount ?? 0);
  const stale = Number(metadata?.staleCredentialCount ?? 0);
  const actions: any[] = [];
  if (reused) actions.push({ id: 'reuse', priority: 'critical', title: 'Eliminate password reuse', action: 'Generate a unique credential for every duplicated account.' });
  if (weak) actions.push({ id: 'weak', priority: 'high', title: 'Upgrade weak credentials', action: 'Replace short or low-complexity credentials with 16+ character high-entropy secrets.' });
  if (stale) actions.push({ id: 'stale', priority: 'medium', title: 'Rotate stale credentials', action: 'Review credentials older than 90 days and rotate sensitive accounts.' });
  if (!actions.length) actions.push({ id: 'maintain', priority: 'low', title: 'Maintain strong hygiene', action: 'Keep MFA enabled and preserve safe backups.' });
  return {
    summary: `Local analysis reports a ${score}/100 posture with ${weak} weak, ${reused} reused, and ${stale} stale credential findings.`,
    topRisk: reused ? 'Password reuse' : weak ? 'Weak passwords' : stale ? 'Stale credentials' : 'No immediate high-severity risks',
    priorityActions: actions,
  };
}

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'SENTINELX Backend', provider: 'Nebius Token Factory', privacyBoundary: true }),
);

app.post('/api/ai/health', async (_req, res) => {
  try {
    const out = await nebius([
      { role: 'system', content: 'Reply with OK only.' },
      { role: 'user', content: 'Ping' },
    ]);
    res.json({ configured: true, connected: true, model: out.model, provider: 'Nebius Token Factory' });
  } catch {
    res.json({ configured: Boolean(process.env.NEBIUS_API_KEY), connected: false, fallback: true, provider: 'Nebius Token Factory' });
  }
});

app.post('/api/security/analyze', async (req, res) => {
  const metadata = req.body?.metadata;
  if (!metadata) return res.status(400).json({ error: 'Missing security metadata' });
  if (!privacySafe(metadata)) return res.status(400).json({ error: 'Security payload rejected: secret-bearing data is not allowed.' });

  try {
    const out = await nebius([
      {
        role: 'system',
        content: 'You are SENTINELX, a privacy-first cybersecurity copilot. Analyze only sanitized, non-secret security metadata. Never ask for or reproduce credentials. Return valid JSON with summary, topRisk, priorityActions (id,priority,title,reason,action,targetDomain), explanations, securityPlan.',
      },
      { role: 'user', content: `Sanitized security metadata:\n${JSON.stringify(metadata)}` },
    ]);
    const cleaned = out.content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const report = JSON.parse(match?.[0] || cleaned);
    res.json({ success: true, fallback: false, provider: 'Nebius Token Factory / NVIDIA Open-Source Model', modelUsed: out.model, report });
  } catch {
    res.json({ success: false, fallback: true, message: 'AI inference unavailable; deterministic local analysis remains active.', provider: 'Deterministic Local Security Engine', report: fallback(metadata) });
  }
});

app.post('/api/security/chat', async (req, res) => {
  const { message, sanitizedContext } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Missing user message' });
  if (message.length > 1200) return res.status(413).json({ error: 'Message is too long.' });
  if (!privacySafe(message)) return res.status(400).json({ error: 'Potential secret-bearing text was blocked.' });
  if (!privacySafe(sanitizedContext || {})) return res.status(400).json({ error: 'Secret-bearing context is prohibited.' });

  try {
    const out = await nebius([
      {
        role: 'system',
        content: `You are Sentinel AI inside SENTINELX. Be concise and actionable. Use only sanitized context. Never request or expose credentials. Context: ${JSON.stringify(sanitizedContext || {})}`,
      },
      { role: 'user', content: message.trim() },
    ]);
    res.json({ success: true, fallback: false, reply: out.content, model: out.model });
  } catch {
    res.json({ success: false, fallback: true, reply: 'Prioritize reused credentials first, then weak and stale credentials. Generate unique high-entropy replacements and enable MFA on sensitive accounts.', model: 'Deterministic Sentinel Engine' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true, host: '0.0.0.0' } });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`SENTINELX running on http://localhost:${PORT}`));
}

start().catch((error) => {
  console.error('SENTINELX failed to start:', error);
  process.exit(1);
});
