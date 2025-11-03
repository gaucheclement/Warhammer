import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib')
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.js'],
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.js'],
      exclude: ['src/lib/**/*.test.js']
    }
  }
})
