import type { AppRole } from '@/types/roles';

export type ApiMode = 'live';

export const appConfig = {
  name: 'QLKTX Web',
  product: 'DormCare Hub',
  phase: 'Backend integration',
  apiMode: 'live' as ApiMode,
  apiBaseUrl:
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'https://qlktx-backend-2302700155.azurewebsites.net',
} as const;

/**
 * Seeded demo identities accepted by backend DEV_AUTH_BYPASS.
 */
export const devUserIds: Record<AppRole, string> = {
  student: '22222222-2222-4222-8222-222222222221',
  staff: '11111111-1111-4111-8111-111111111111',
  admin: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
