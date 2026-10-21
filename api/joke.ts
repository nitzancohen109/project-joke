// Vercel function for POST /api/joke — a thin wrapper around the shared module.
import { handleJokeRequest } from './_lib/joke.js';

export default {
  async fetch(request: Request): Promise<Response> {
    const { status, body } = await handleJokeRequest(request.method, await request.text());
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  },
};
