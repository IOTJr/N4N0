import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase-server';

export const ADMIN_SESSION_COOKIE = 'n4n0_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const PASSWORD_SCRYPT_KEYLEN = 64;

type AdminRecord = {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  fullName?: string;
};

function getAdminConfig() {
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

  if (!adminSessionSecret) {
    throw new Error('Missing ADMIN_SESSION_SECRET environment variable');
  }

  return {
    adminSessionSecret,
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, PASSWORD_SCRYPT_KEYLEN).toString('hex');
}

function parseAdminRecord(row: Record<string, unknown>): AdminRecord | null {
  const email = String(row.email ?? '').trim().toLowerCase();
  const passwordHash = String(row.password_hash ?? '').trim();
  const passwordSalt = String(row.password_salt ?? '').trim();
  const fullName = String(row.full_name ?? '').trim();

  if (!email || !passwordHash || !passwordSalt) {
    return null;
  }

  return {
    email,
    passwordHash,
    passwordSalt,
    fullName,
  };
}

function safeCompare(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

async function getAdminRows() {
  const { data, error } = await supabaseServer.from('admins').select('*');
  if (error) {
    console.error('Failed to fetch admins table:', error.message);
    return [];
  }

  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function verifyAdminCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const adminRows = await getAdminRows();

  const matchingRow = adminRows.find((row) => {
    const parsed = parseAdminRecord(row as Record<string, unknown>);
    return parsed?.email === normalizedEmail;
  });

  if (!matchingRow) {
    return false;
  }

  const admin = parseAdminRecord(matchingRow as Record<string, unknown>);
  if (!admin) {
    return false;
  }

  const candidateHash = hashPassword(password, admin.passwordSalt);
  return safeCompare(candidateHash, admin.passwordHash);
}

export async function hasAdminUsers() {
  const adminRows = await getAdminRows();
  return adminRows.length > 0;
}

export async function createAdminUser(input: { email: string; password: string; fullName?: string }) {
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');
  const fullName = String(input.fullName ?? '').trim();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (password.length < 10) {
    return { success: false, error: 'Password must be at least 10 characters long.' };
  }

  const existingRows = await getAdminRows();
  const exists = existingRows.some((row) => {
    const parsed = parseAdminRecord(row as Record<string, unknown>);
    return parsed?.email === email;
  });

  if (exists) {
    return { success: false, error: 'This admin email already exists.' };
  }

  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, passwordSalt);

  const { error } = await supabaseServer.from('admins').insert([
    {
      email,
      full_name: fullName,
      password_hash: passwordHash,
      password_salt: passwordSalt,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return { success: false, error: 'Failed to create admin account.' };
  }

  return { success: true };
}

export function createAdminSessionToken(email: string) {
  const { adminSessionSecret } = getAdminConfig();
  const payload = JSON.stringify({
    email: normalizeEmail(email),
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  const signature = crypto
    .createHmac('sha256', adminSessionSecret)
    .update(payload)
    .digest('hex');

  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const { adminSessionSecret } = getAdminConfig();
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return false;
  }

  let payloadText = '';
  try {
    payloadText = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', adminSessionSecret)
    .update(payloadText)
    .digest('hex');

  const signatureMatches =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!signatureMatches) {
    return false;
  }

  try {
    const payload = JSON.parse(payloadText) as {
      email?: string;
      expiresAt?: number;
    };

    if (!payload.email || !payload.expiresAt) {
      return false;
    }

    return payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function getAdminSessionTokenFromCookies() {
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function isAdminAuthenticated() {
  return verifyAdminSessionToken(await getAdminSessionTokenFromCookies());
}
