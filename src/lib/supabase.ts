import { createClient, type SupabaseClient } from '@supabase/supabase-js';

interface ViteImportMeta extends ImportMeta {
  env?: Record<string, string | boolean | undefined>;
}

const LOCAL_PREVIEW_USER_ID = '00000000-0000-4000-8000-000000000000';

function readViteEnv(key: string): string {
  const metaEnv = (import.meta as ViteImportMeta).env;
  const raw = metaEnv?.[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

const rawSupabaseUrl = readViteEnv('VITE_SUPABASE_URL');
const rawSupabaseAnonKey = readViteEnv('VITE_SUPABASE_ANON_KEY');

const hasValidUrl =
  rawSupabaseUrl.startsWith('https://') || rawSupabaseUrl.startsWith('http://');

export const isSupabaseConfigured: boolean = Boolean(hasValidUrl && rawSupabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getStorageMode(): 'supabase' | 'local_preview' {
  return isSupabaseConfigured && supabase ? 'supabase' : 'local_preview';
}

export async function getAuthenticatedSupabaseUserId(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return data.user.id;
  } catch {
    return null;
  }
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      return null;
    }
    return data.session.access_token;
  } catch {
    return null;
  }
}

export async function getActiveUserId(): Promise<string> {
  const authenticatedId = await getAuthenticatedSupabaseUserId();
  return authenticatedId ?? LOCAL_PREVIEW_USER_ID;
}
