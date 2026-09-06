export type Credential = {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  updatedAt: string;
};

export type SecurityMetrics = {
  score: number;
  weak: Credential[];
  reused: Credential[];
  stale: Credential[];
};

const SENSITIVE_KEY_NAMES = new Set([
  'password', 'passwd', 'passcode', 'masterpassword', 'master_password',
  'secret', 'secretkey', 'secret_key', 'encryptionkey', 'encryption_key',
  'apikey', 'api_key', 'access_token', 'refresh_token', 'private_key',
]);

const SENSITIVE_TEXT_MARKERS = [
  'password:', 'password=', 'passwd:', 'passwd=', 'passcode:', 'passcode=',
  'plaintext', 'masterpassword', 'master_password', 'secretkey', 'secret_key',
  'encryptionkey', 'encryption_key', 'api_key=', 'apikey=', 'access_token=',
  'refresh_token=', 'private_key',
];

export function containsSensitiveInput(value: unknown): boolean {
  const inspect = (item: unknown): boolean => {
    if (item == null) return false;
    if (typeof item === 'string') {
      const normalized = item.toLowerCase();
      return SENSITIVE_TEXT_MARKERS.some((marker) => normalized.includes(marker));
    }
    if (Array.isArray(item)) return item.some(inspect);
    if (typeof item === 'object') {
      for (const [key, child] of Object.entries(item as Record<string, unknown>)) {
        if (SENSITIVE_KEY_NAMES.has(key.toLowerCase())) return true;
        if (inspect(child)) return true;
      }
    }
    return false;
  };

  try { return inspect(value); } catch { return true; }
}

export function privacySafe(value: unknown): boolean {
  return value != null && !containsSensitiveInput(value);
}

export function scoreFor(items: Credential[], nowMs = Date.now()): SecurityMetrics {
  let score = 100;
  const weak = items.filter(
    (c) => c.password.length < 12 || !/[A-Z]/.test(c.password) || !/[a-z]/.test(c.password) || !/\d/.test(c.password),
  );
  const groups = new Map<string, number>();
  items.forEach((c) => groups.set(c.password, (groups.get(c.password) || 0) + 1));
  const reused = items.filter((c) => (groups.get(c.password) || 0) > 1);
  const stale = items.filter((c) => (nowMs - new Date(c.updatedAt).getTime()) / 86400000 > 90);
  score -= weak.length * 10;
  score -= new Set(reused.map((c) => c.password)).size * 12;
  score -= stale.length * 6;
  return { score: Math.max(0, Math.min(100, score)), weak, reused, stale };
}

export function generateSecureCredential(length = 20): string {
  if (!Number.isInteger(length) || length < 16 || length > 128) {
    throw new Error('Credential length must be an integer between 16 and 128.');
  }
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  const limit = Math.floor(0x100000000 / alphabet.length) * alphabet.length;
  let result = '';
  const buffer = new Uint32Array(64);
  while (result.length < length) {
    crypto.getRandomValues(buffer);
    for (const value of buffer) {
      if (value >= limit) continue;
      result += alphabet[value % alphabet.length];
      if (result.length === length) break;
    }
  }
  return result;
}

export function buildSanitizedMetadata(metrics: SecurityMetrics, totalCredentials: number) {
  return {
    securityScore: metrics.score,
    totalCredentials,
    weakCount: metrics.weak.length,
    reusedCount: new Set(metrics.reused.map((item) => item.password)).size,
    staleCredentialCount: metrics.stale.length,
    riskCategories: [...new Set([
      ...metrics.weak.map(() => 'weak_passwords'),
      ...metrics.reused.map(() => 'password_reuse'),
      ...metrics.stale.map(() => 'stale_credentials'),
    ])],
  };
}
