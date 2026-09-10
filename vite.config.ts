import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages project site is served from /<repo-name>/
export default defineConfig({
  base: '/WellnessApp/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        // Force any previously-installed service worker to take over and
        // discard its old precache immediately on the next visit, instead
        // of leaving a stale app shell running until every tab is closed.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Mental Wellness',
        short_name: 'Wellness',
        description: 'Brain training, meditation, habits and mindful reading.',
        theme_color: '#6B8F84',
        background_color: '#F6F3EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/WellnessApp/',
        scope: '/WellnessApp/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
