import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the 'environment' directory based on the current mode
  const env = loadEnv(mode, path.resolve(__dirname, '../environment'), 'VITE_');

  return {
    // ── Plugins ────────────────────────────────────────────────────────────────
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'splash-screen.png'],
        devOptions: {
          enabled: true,
        },
        workbox: {
          // Cache-first strategy for static assets
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: new RegExp(`^${env.VITE_API_BASE_URL}`),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
                networkTimeoutSeconds: 10,
              },
            },
          ],
        },
        manifest: {
          name: env.VITE_APP_NAME || 'PWA Workshop Flow',
          short_name: 'PWAFlow',
          description: 'A scalable mobile-first PWA boilerplate',
          theme_color: 'hsl(258, 90%, 60%)',
          background_color: 'hsl(222, 25%, 8%)',
          display: 'standalone',
          display_override: ['standalone', 'minimal-ui'],
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          lang: 'pt-BR',
          categories: ['productivity'],
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshots/splash-screen.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'PWA Workshop Flow - Home',
            },
          ],
        },
      }),
    ],

    // ── Path Aliases ───────────────────────────────────────────────────────────
    resolve: {
      alias: {
        '@core': path.resolve(__dirname, '../src/app/core'),
        '@shared': path.resolve(__dirname, '../src/app/shared'),
        '@features': path.resolve(__dirname, '../src/app/features'),
        '@themes': path.resolve(__dirname, '../themes'),
        '@assets': path.resolve(__dirname, '../assets'),
        '@app': path.resolve(__dirname, '../src/app'),
        '@src': path.resolve(__dirname, '../src'),
      },
    },

    // ── Environment Variables ──────────────────────────────────────────────────
    define: {
      'import.meta.env': { ...env },
    },

    // ── Dev Server ─────────────────────────────────────────────────────────────
    server: {
      port: 5173,
      host: true,
      open: false,
    },

    // ── Build ──────────────────────────────────────────────────────────────────
    build: {
      outDir: '../dist',
      sourcemap: mode !== 'production',
    },

    // ── Public Assets ──────────────────────────────────────────────────────────
    publicDir: '../assets',
  };
});
