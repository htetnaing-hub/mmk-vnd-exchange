import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// `base: './'` makes the build work on GitHub Pages under any repository name.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
