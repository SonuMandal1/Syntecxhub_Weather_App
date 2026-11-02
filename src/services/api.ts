const BASE = 'https://api.openweathermap.org';

export const API_KEY: string = import.meta.env.VITE_OWM_API_KEY?.trim() ?? '';
export const HAS_KEY = API_KEY.length > 0;

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const messageFor = (status: number): string => {
  if (status === 401) return 'The weather API key was rejected. Check VITE_OWM_API_KEY.';
  if (status === 404) return 'No data found for that location.';
  if (status === 429) return 'Too many requests. Try again in a minute.';
  if (status >= 500) return 'The weather service is having trouble. Try again shortly.';
  return 'Something went wrong while loading weather data.';
};

/** Retry only network failures, 429 and 5xx, with exponential backoff. */
const retryable = (e: unknown): boolean =>
  e instanceof ApiError ? e.status === 429 || e.status >= 500 : !(e instanceof DOMException && e.name === 'AbortError');

export async function apiGet<T>(
  path: string,
  params: Record<string, string | number>,
  opts: { signal?: AbortSignal; retries?: number } = {},
): Promise<T> {
  const { signal, retries = 2 } = opts;
  const qs = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), appid: API_KEY });
  const url = `${BASE}${path}?${qs.toString()}`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new ApiError(messageFor(res.status), res.status);
      return (await res.json()) as T;
    } catch (e) {
      lastError = e;
      if (attempt === retries || !retryable(e)) break;
      await sleep(400 * 2 ** attempt);
    }
  }
  if (lastError instanceof ApiError || (lastError instanceof DOMException && lastError.name === 'AbortError')) {
    throw lastError;
  }
  throw new ApiError('Network error. Check your connection and try again.', 0);
}
