import { appConfig, devUserIds, getActiveRole, getSession } from '@/config/app';

export class ApiError extends Error {
  status: number;
  requestId?: string;

  constructor(message: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.requestId = requestId;
  }
}

type ApiEnvelope<T> = { data: T; meta?: unknown };

/**
 * Thin fetch wrapper for Backend-QLKTX. All responses use the {data, meta} envelope.
 * Auth: until Supabase Auth is wired on web, live mode identifies the active role
 * through the backend DEV_AUTH_BYPASS header (local development only).
 */
export async function http<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      // Authenticated session id from /api/auth/login; seeded dev id as fallback.
      'x-dev-user-id': getSession()?.id ?? devUserIds[getActiveRole()],
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // non-JSON response body
  }

  if (!response.ok) {
    const errorBody = payload as { error?: { message?: string; requestId?: string } } | null;
    throw new ApiError(
      errorBody?.error?.message ?? `HTTP ${response.status}`,
      response.status,
      errorBody?.error?.requestId,
    );
  }

  return (payload as ApiEnvelope<T>).data;
}
