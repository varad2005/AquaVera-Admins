/**
 * Authenticated fetch wrapper that ensures cookies (HttpOnly JWT token)
 * are always sent with every API request.
 *
 * This is required because browsers do not automatically include cookies
 * in fetch() requests; `credentials: 'include'` must be explicitly set.
 */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "include", // Always send HttpOnly cookies
  });
}
