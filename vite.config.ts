import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'app_logo.svg',
          'app_logo.jpg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'icon-192.png',
          'icon-512.png',
          'education_resources.json'
        ],
        manifest: {
          id: '/',
          name: 'AnestesiaPro - Suite Clínica (Dr. Carlos Leal)',
          short_name: 'AnestesiaPro',
          description: 'Suite clínica para anestesiología y quirófano 100% funcional offline.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['medical', 'health', 'education'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/app_logo.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB to allow the rich clinical bundle
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2,json}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 3,
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /\/api\/education\/resources.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-education-cache',
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-images-cache',
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 150,
                  maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
