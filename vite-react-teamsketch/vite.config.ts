import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Haru - 당신의 취미를 공유하세요',
        short_name: 'Haru',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png'
          },         
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB로 증가
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourbackend\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24시간
              }
            }
          }
        ]
      }
    })
  ],
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: 'crypto-browserify'
    },
  },
  server: {   
    host: true, // true로 변경 
    port: 3000, // 3000으로 나중에 변경
    allowedHosts: [
      'sunbee.world',
      'www.sunbee.world',
      'localhost',
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      external: ['fs', 'path', 'crypto'],
      output: {
        manualChunks: {
          'opencv': ['opencv.js']
        }
      }
    },
  },
})