import type { AppRole } from '@/types/roles';

export type ApiMode = 'mock' | 'live';

const rawMode = import.meta.env.VITE_API_MODE as string | undefined;

export const appConfig = {
  name: 'QLKTX Web',
  product: 'DormCare Hub',
  phase: 'Backend integration',
  /**
   * mock: repositories serve in-memory data from src/mocks (default, no backend needed).
   * live: repositories call the Backend-QLKTX REST API (VITE_API_URL).
   */
  apiMode: (rawMode === 'live' ? 'live' : 'mock') as ApiMode,
  apiBaseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000',
} as const;

/**
 * Seeded local-dev identities (Backend-QLKTX/database/local-dev-seed.sql).
 * In live mode without Supabase Auth, the backend DEV_AUTH_BYPASS accepts these
 * via the x-dev-user-id header. Replaced by real Supabase sessions later.
 */
export const devUserIds: Record<AppRole, string> = {
  student: '33333333-3333-4333-8333-333333333333',
  staff: '22222222-2222-4222-8222-222222222222',
  admin: '11111111-1111-4111-8111-111111111111',
};

const ROLE_STORAGE_KEY = 'qlktx.role';
const SESSION_STORAGE_KEY = 'qlktx.session';

export function getActiveRole(): AppRole {
  const session = getSession();
  if (session) return session.role;
  const stored = localStorage.getItem(ROLE_STORAGE_KEY);
  return stored === 'staff' || stored === 'admin' ? stored : 'student';
}

export function setActiveRole(role: AppRole) {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

/** Authenticated identity returned by POST /api/auth/login (live mode). */
export type AuthSession = {
  id: string;
  role: AppRole;
  name: string;
  initials: string;
  email?: string;
  /** student_code or staff_code from the login response. */
  code?: string;
};

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed && typeof parsed.id === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  setActiveRole(session.role);
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
