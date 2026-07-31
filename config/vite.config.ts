import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the 'environment' directory based on the current mode
  const env = loadEnv(mode, path.resolve(__dirname, '../environment'), 'VITE_');

  return {
    // ── Plugins ────────────────────────────────────────────────────────────────
    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.svg', 'icons/icon-72x72.png', 'icons/icon-192x192.png', 'icons/icon-512x512.png', 'screenshots/splash-screen.png'],
        devOptions: {
          enabled: true,
          type: 'module',
          suppressWarnings: true,
        },
        injectManifest: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
        manifest: {
          name: env.VITE_APP_NAME || 'Worship Flow',
          short_name: 'WorshipFlow',
          description: 'Worship Flow - Elevando a música do seu ministério',
          theme_color: '#7c3aed',
          background_color: '#0f121d',
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
              purpose: 'any',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshots/splash-screen.png',
              sizes: '360x640',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Worship Flow - Home',
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
    envDir: path.resolve(__dirname, '../environment'),

    // ── Dev Server ─────────────────────────────────────────────────────────────
    server: {
      port: 5173,
      host: true,
      open: false,
    },

    // ── Build ──────────────────────────────────────────────────────────────────
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      sourcemap: mode !== 'production',
    },

    // ── Public Assets ──────────────────────────────────────────────────────────
    publicDir: path.resolve(__dirname, '../assets'),
  };
});
