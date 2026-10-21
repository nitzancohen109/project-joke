import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// One-off icon generation from public/icon.svg: `npm run generate-icons`.
// Re-run after replacing the source with the kitten artwork (DESIGN 2.4.1).
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#F7AEB8' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#F7AEB8' } },
  },
  images: ['public/icon.svg'],
});
