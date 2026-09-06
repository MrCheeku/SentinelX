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

const SENSITIVE_MARKERS = [
  'password:', 'password=', 'passwd:', 'passwd=', 'passcode:', 'passcode=',
  'plaintext', 'masterpassword', 'master_password', 'secretkey', 'secret_key',
  'encryptionkey', 'encryption_key', 'api_key=', 'apikey=', 'access_token=',
  'refresh_token=', 'private_key',
];

export function containsSensitiveInput(value: unknown): boolean {
  if (value == null) return false;
  let text: string;
  try {
    text = typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    return true;
  }
  const normalized = text.toLowerCase();
  return SENSITIVE_MARKERS.some((marker) => normalized.includes(marker));
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
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
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
