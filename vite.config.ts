import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    (env.VITE_API_URL && env.VITE_API_URL.startsWith('http')
      ? env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')
      : 'http://localhost:3000');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Allow the shared Vite dev server to be reached through an ngrok tunnel
      // (see the team's ngrok setup notes in docs/api-contract.md).
      allowedHosts: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('react-router')) {
                return 'vendor-router';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-query';
              }
              if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
                return 'vendor-form';
              }
            }
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      restoreMocks: true,
    },
  };
});

