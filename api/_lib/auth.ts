import { createHash, timingSafeEqual } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface AuthRequestLike {
  headers: Record<string, string | string[] | undefined>;
}

export interface AdminVerificationResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  mode: 'supabase' | 'local_dev_bypass_disabled';
  statusCode: 200 | 401 | 403 | 503;
  error?: string;
}

export interface CronOrAdminVerificationResult {
  authorized: boolean;
  actor: 'cron' | 'admin' | 'none';
  userId?: string;
  mode: 'supabase' | 'cron_secret' | 'local_dev_bypass_disabled';
  statusCode: 200 | 401 | 403 | 503;
  error?: string;
}

const MAX_BEARER_TOKEN_LENGTH = 8192;

function getHeaderValue(
  headers: Record<string, string | string[] | undefined>,
  targetName: string,
): string | undefined {
  const lowerTarget = targetName.toLowerCase();

  for (const [key, rawValue] of Object.entries(headers)) {
    if (key.toLowerCase() !== lowerTarget) {
      continue;
    }

    if (typeof rawValue === 'string') {
      return rawValue;
    }

    if (Array.isArray(rawValue) && rawValue.length > 0 && typeof rawValue[0] === 'string') {
      return rawValue[0];
    }
  }

  return undefined;
}

function extractBearerToken(headers: Record<string, string | string[] | undefined>): string | null {
  const authHeader = getHeaderValue(headers, 'authorization');
  if (!authHeader) {
    return null;
  }

  const trimmed = authHeader.trim();
  const match = trimmed.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return null;
  }

  const token = match[1];
  if (!token || token.length > MAX_BEARER_TOKEN_LENGTH) {
    return null;
  }

  return token;
}

function constantTimeSecretEqual(provided: string, expected: string): boolean {
  if (!provided || !expected) {
    return false;
  }

  // Hash both values to fixed 32-byte digests so timingSafeEqual never leaks secret length
  const providedDigest = createHash('sha256').update(provided, 'utf8').digest();
  const expectedDigest = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(providedDigest, expectedDigest);
}

function getSupabaseServerConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function createServerSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseServerConfig();
  if (!config) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function hasAdminAppMetadata(appMetadata: Record<string, unknown> | undefined): boolean {
  return Boolean(appMetadata && appMetadata.role === 'admin');
}

export async function verifyAdminRequest(req: AuthRequestLike): Promise<AdminVerificationResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return {
      authorized: false,
      mode: 'local_dev_bypass_disabled',
      statusCode: 503,
      error:
        'Admin authentication is not configured on the server (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).',
    };
  }

  const token = extractBearerToken(req.headers);
  if (!token) {
    return {
      authorized: false,
      mode: 'supabase',
      statusCode: 401,
      error: 'Missing or malformed Authorization Bearer token.',
    };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return {
        authorized: false,
        mode: 'supabase',
        statusCode: 401,
        error: 'Invalid or expired authentication token.',
      };
    }

    const user = userData.user;
    let isAdmin = hasAdminAppMetadata(user.app_metadata);

    if (!isAdmin) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle<{ role: string | null }>();

      if (!profileError && profile?.role === 'admin') {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return {
        authorized: false,
        userId: user.id,
        mode: 'supabase',
        statusCode: 403,
        error: 'Forbidden: administrator role is required.',
      };
    }

    return {
      authorized: true,
      userId: user.id,
      email: user.email,
      mode: 'supabase',
      statusCode: 200,
    };
  } catch {
    return {
      authorized: false,
      mode: 'supabase',
      statusCode: 503,
      error: 'Authentication verification failed due to an upstream error.',
    };
  }
}

export async function verifyCronOrAdmin(
  req: AuthRequestLike,
): Promise<CronOrAdminVerificationResult> {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const token = extractBearerToken(req.headers);

  if (cronSecret && token && constantTimeSecretEqual(token, cronSecret)) {
    return {
      authorized: true,
      actor: 'cron',
      mode: 'cron_secret',
      statusCode: 200,
    };
  }

  const adminResult = await verifyAdminRequest(req);
  if (adminResult.authorized) {
    return {
      authorized: true,
      actor: 'admin',
      userId: adminResult.userId,
      mode: 'supabase',
      statusCode: 200,
    };
  }

  if (!cronSecret && adminResult.mode === 'local_dev_bypass_disabled') {
    return {
      authorized: false,
      actor: 'none',
      mode: 'local_dev_bypass_disabled',
      statusCode: 503,
      error:
        'Scheduled and admin authentication are not configured (missing CRON_SECRET and Supabase server credentials).',
    };
  }

  return {
    authorized: false,
    actor: 'none',
    userId: adminResult.userId,
    mode: adminResult.mode,
    statusCode: adminResult.statusCode,
    error: adminResult.error ?? 'Unauthorized request.',
  };
}
