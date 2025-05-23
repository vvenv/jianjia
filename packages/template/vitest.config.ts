import { cwd, env } from 'node:process'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  return {
    test: {
      env: loadEnv(mode, cwd(), ''),
      include: ['**/*.test.ts'],
      exclude: ['**/node_modules/**'],
      reporters: env.GITHUB_ACTIONS ? ['github-actions'] : ['default'],
      coverage: {
        enabled: true,
        reporter: env.GITHUB_ACTIONS ? ['text'] : ['html'],
      },
    },
  }
})
