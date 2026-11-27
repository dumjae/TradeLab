import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AuthSessionState, AuthUserProfile, UserRole } from '../types/auth';

const LOCAL_PREVIEW_AUTH_KEY = 'tradelab_local_preview_auth_v1';

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface AuthContextValue extends AuthSessionState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ needsConfirmation: boolean }>;
  signInLocalPreview: (role: UserRole, email?: string) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(rawRole: unknown): UserRole {
  return rawRole === 'admin' ? 'admin' : 'learner';
}

function readLocalPreviewProfile(): AuthUserProfile | null {
  if (typeof window === 'undefined' || isSupabaseConfigured) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_PREVIEW_AUTH_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<AuthUserProfile>;
    if (
      !parsed ||
      typeof parsed.id !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.displayName !== 'string'
    ) {
      return null;
    }
    return {
      id: parsed.id,
      email: parsed.email,
      displayName: parsed.displayName,
      avatarUrl: typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : null,
      role: normalizeRole(parsed.role),
      authProvider: 'local_preview',
    };
  } catch {
    return null;
  }
}

function writeLocalPreviewProfile(profile: AuthUserProfile | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (profile) {
      window.localStorage.setItem(LOCAL_PREVIEW_AUTH_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(LOCAL_PREVIEW_AUTH_KEY);
    }
  } catch {
    // Ignore restricted browser storage errors
  }
}

function buildFallbackProfile(authUser: SupabaseUser): AuthUserProfile {
  const email = authUser.email ?? '';
  const metadata = authUser.user_metadata ?? {};
  const metaName =
    (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
    (typeof metadata.name === 'string' && metadata.name.trim()) ||
    (typeof metadata.display_name === 'string' && metadata.display_name.trim()) ||
    '';
  const metaAvatar =
    (typeof metadata.avatar_url === 'string' && metadata.avatar_url.trim()) ||
    (typeof metadata.picture === 'string' && metadata.picture.trim()) ||
    null;

  const provider = authUser.app_metadata?.provider === 'google' ? 'google' : 'email';

  return {
    id: authUser.id,
    email,
    displayName: metaName || (email ? email.split('@')[0] : 'Trader'),
    avatarUrl: metaAvatar,
    role: 'learner',
    authProvider: provider,
  };
}

async function fetchUserProfile(authUser: SupabaseUser): Promise<AuthUserProfile> {
  const fallback = buildFallbackProfile(authUser);

  if (!supabase) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, avatar_url, role')
      .eq('id', authUser.id)
      .maybeSingle<ProfileRow>();

    if (error || !data) {
      return fallback;
    }

    return {
      id: data.id || fallback.id,
      email: data.email?.trim() || fallback.email,
      displayName: data.display_name?.trim() || fallback.displayName,
      avatarUrl: data.avatar_url?.trim() || fallback.avatarUrl,
      role: normalizeRole(data.role),
      authProvider: fallback.authProvider,
    };
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserProfile | null>(() =>
    isSupabaseConfigured ? null : readLocalPreviewProfile(),
  );
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const syncFromSupabaseSession = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(readLocalPreviewProfile());
      setLoading(false);
      return;
    }

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        setUser(null);
        return;
      }

      if (data.session?.user) {
        const profile = await fetchUserProfile(data.session.user);
        setUser(profile);
        setError(null);
      } else {
        setUser(null);
      }
    } catch {
      setError('Unable to verify authentication session.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const init = async () => {
      await syncFromSupabaseSession();
    };
    void init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      void fetchUserProfile(session.user).then((profile) => {
        if (!active) {
          return;
        }
        setUser(profile);
        setError(null);
        setLoading(false);
      });
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [syncFromSupabaseSession]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      const message = 'Google sign-in is unavailable in preview mode.';
      setError(message);
      throw new Error(message);
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      throw new Error(oauthError.message);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      const message = 'Email sign-in is unavailable in preview mode.';
      setError(message);
      throw new Error(message);
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      throw new Error(signInError.message);
    }

    if (data.user) {
      const profile = await fetchUserProfile(data.user);
      setUser(profile);
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
    ): Promise<{ needsConfirmation: boolean }> => {
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        const message = 'Account registration is unavailable in preview mode.';
        setError(message);
        throw new Error(message);
      }

      const trimmedName = displayName.trim();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: trimmedName,
            display_name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        throw new Error(signUpError.message);
      }

      if (data.session && data.user) {
        const profile = await fetchUserProfile(data.user);
        setUser(profile);
        return { needsConfirmation: false };
      }

      return { needsConfirmation: true };
    },
    [],
  );

  const signInLocalPreview = useCallback((role: UserRole, email?: string) => {
    if (isSupabaseConfigured) {
      throw new Error('Local Preview sign-in is disabled when Supabase is configured.');
    }

    const normalizedRole: UserRole = role === 'admin' ? 'admin' : 'learner';
    const resolvedEmail =
      email?.trim() ||
      (normalizedRole === 'admin' ? 'admin.preview@tradelab.local' : 'learner.preview@tradelab.local');

    const previewUser: AuthUserProfile = {
      id: '00000000-0000-4000-8000-000000000000',
      email: resolvedEmail,
      displayName: normalizedRole === 'admin' ? 'Admin Curator (Preview)' : 'Academy Learner (Preview)',
      avatarUrl: null,
      role: normalizedRole,
      authProvider: 'local_preview',
    };

    writeLocalPreviewProfile(previewUser);
    setUser(previewUser);
    setError(null);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setError(null);

    if (isSupabaseConfigured && supabase) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
      }
    }

    writeLocalPreviewProfile(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(readLocalPreviewProfile());
      return;
    }

    setLoading(true);
    await syncFromSupabaseSession();
  }, [syncFromSupabaseSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      error,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInLocalPreview,
      signOut,
      refreshProfile,
    }),
    [
      user,
      loading,
      error,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInLocalPreview,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}
