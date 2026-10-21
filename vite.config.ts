import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PWA plugin (M3) and the /api/joke dev middleware (M2) will be added here later.
export default defineConfig({
  plugins: [react()],
});
