import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'fs'
import path from 'path'

// Plugin to embed JSON data as a JavaScript constant
function embedDataPlugin() {
  return {
    name: 'embed-data',
    transformIndexHtml(html) {
      // Read the all-data.json file
      const dataPath = path.resolve(__dirname, './data/all-data.json')
      let dataContent = '{}'

      if (fs.existsSync(dataPath)) {
        dataContent = fs.readFileSync(dataPath, 'utf-8')
      } else {
        console.warn('Warning: data/all-data.json not found. Using empty data.')
      }

      // Embed data as a global constant in a script tag
      const dataScript = `
        <script>
          window.__WARHAMMER_DATA__ = ${dataContent};
        </script>
      `

      // Insert the script before the closing head tag
      return html.replace('</head>', `${dataScript}</head>`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    embedDataPlugin(),
    createHtmlPlugin({
      minify: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        // Issue #19 Stream B: Increase file size limit for single-file build
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB (single-file app)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'Warhammer Fantasy Roleplay 4th Edition',
        short_name: 'WFRP 4e',
        description: 'Warhammer Fantasy Roleplay 4th edition - Progressive Web Application',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    viteSingleFile(),
    // Issue #19 Stream B: Bundle analysis visualization
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Options: treemap, sunburst, network
    })
  ],
  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src/lib')
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 100000000, // Inline all assets
    cssCodeSplit: false,
    // Issue #19 Stream B: Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.trace']
      },
      mangle: {
        safari10: true // Fix Safari 10 issues
      }
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        // Issue #19 Stream B: Optimize chunk names
        manualChunks: undefined
      }
    },
    // Issue #19 Stream B: Report compressed size
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500 // Warn if chunk exceeds 500KB
  }
})
