import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { MAX_BODY_BYTES } from './api/_lib/config.js';

// Dev-only: serve POST /api/joke from the same shared module the Vercel function uses.
function jokeApiDevPlugin(): Plugin {
  return {
    name: 'joke-api-dev',
    apply: 'serve',
    configResolved(config) {
      // Expose only the server-side key to the dev server process (never to the browser).
      const env = loadEnv(config.mode, process.cwd(), '');
      if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
    },
    configureServer(server) {
      server.middlewares.use('/api/joke', async (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(body));
        };

        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            chunks.push(chunk);
            size += chunk.length;
            // Stop reading once over the cap; the shared handler then returns 413.
            if (size > MAX_BODY_BYTES) break;
          }
          const rawBody = Buffer.concat(chunks).toString('utf8');

          const mod = await server.ssrLoadModule('/api/_lib/joke.ts');
          const { status, body } = await mod.handleJokeRequest(req.method, rawBody);
          send(status, body);
        } catch (err) {
          console.error('[joke-dev] middleware error', err instanceof Error ? err.name : err);
          send(502, { error: 'GENERATION_FAILED', message: 'לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב.' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    jokeApiDevPlugin(),
    VitePWA({
      // No update prompt in the UI (PRD: single screen); a new version takes over
      // only after all app windows are closed, never in the middle of a request (ADR-4).
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        name: 'בדיחה בלחיצה',
        short_name: 'בדיחה בלחיצה',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#F7AEB8',
        background_color: '#FFF4ED',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell only: HTML, JS, CSS, fonts, kitten illustration and icons.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // No runtimeCaching: /api/* responses are never cached.
      },
    }),
  ],
});
