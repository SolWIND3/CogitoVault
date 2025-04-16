import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are resolved correctly
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Ensures single-page app behavior
      },
    },
  },
});
