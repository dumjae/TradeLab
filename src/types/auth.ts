export type UserRole = 'learner' | 'admin';

export interface AuthUserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  authProvider: 'google' | 'email' | 'local_preview';
}

export interface AuthSessionState {
  user: AuthUserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
}
