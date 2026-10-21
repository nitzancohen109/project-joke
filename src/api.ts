// Client for POST /api/joke. No API key here — the server holds it.
export type JokeResult =
  | { kind: 'success'; joke: string }
  | { kind: 'offline' }
  | { kind: 'topicTooLong' }
  | { kind: 'error' };

// Stop waiting after 30 seconds (PRD FR-04, ARCHITECTURE 2.5).
const CLIENT_TIMEOUT_MS = 30_000;

// Offline vs. error follows ARCHITECTURE 2.6. No automatic retry, to avoid double AI charges.
export async function requestJoke(topic: string): Promise<JokeResult> {
  if (!navigator.onLine) return { kind: 'offline' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch('/api/joke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timer);
    // Timeout counts as an error; a request that never reached the server counts as offline.
    return controller.signal.aborted ? { kind: 'error' } : { kind: 'offline' };
  }

  try {
    if (res.status === 400) return { kind: 'topicTooLong' };
    if (res.status !== 200) return { kind: 'error' };

    // Reading the body is still covered by the same timeout.
    const data: unknown = await res.json();
    const joke = (data as { joke?: unknown } | null)?.joke;
    if (typeof joke !== 'string' || joke.trim() === '') return { kind: 'error' };
    return { kind: 'success', joke };
  } catch {
    return { kind: 'error' };
  } finally {
    clearTimeout(timer);
  }
}
