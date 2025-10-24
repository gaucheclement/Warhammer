import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createHtmlPlugin } from 'vite-plugin-html'
import fs from 'fs'
import path from 'path'

// Plugin to embed JSON data as a JavaScript constant
function embedDataPlugin() {
  return {
    name: 'embed-data',
    transformIndexHtml(html) {
      // Read the all-data.json file
      const dataPath = path.resolve(__dirname, '../data/all-data.json')
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
    viteSingleFile()
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
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  }
})
