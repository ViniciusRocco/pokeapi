import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/pokeapi/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: false,
    pool: 'threads',
    maxWorkers: 1,
    exclude: ['.test-dist/**', 'node_modules/**'],
  },
})
