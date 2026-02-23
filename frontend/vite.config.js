import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // 🔥 Hot Module Reload para Docker
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    // 📁 Poll file system para detectar mudanças em docker
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
