// Client for POST /api/joke. No API key here — the server holds it.
// Offline/timeout distinction and user-facing messages arrive in Milestone 3.
export type JokeResponse = { ok: true; joke: string } | { ok: false };

export async function requestJoke(topic: string): Promise<JokeResponse> {
  try {
    const res = await fetch('/api/joke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
      cache: 'no-store',
    });
    if (res.status !== 200) return { ok: false };

    const data: unknown = await res.json();
    const joke = (data as { joke?: unknown } | null)?.joke;
    if (typeof joke !== 'string' || joke.trim() === '') return { ok: false };
    return { ok: true, joke };
  } catch {
    return { ok: false };
  }
}
