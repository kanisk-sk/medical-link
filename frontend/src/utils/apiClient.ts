export type TokenProvider = () => Promise<string | null | undefined>;

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  getToken: TokenProvider
) {
  const token = await getToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

export function createApiClient(getToken: TokenProvider) {
  return {
    get: (url: string, init?: RequestInit) => authenticatedFetch(url, { ...init, method: 'GET' }, getToken),
    post: (url: string, body?: unknown, init?: RequestInit) =>
      authenticatedFetch(
        url,
        {
          ...init,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        },
        getToken
      ),
  };
}
