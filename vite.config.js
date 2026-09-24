import { defineConfig } from 'vite';

// base './' keeps every asset path relative, so the build works from the
// domain root without leaking root-absolute /assets/ paths.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
