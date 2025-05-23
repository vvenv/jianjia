import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    test: {
      env: loadEnv(mode, process.cwd(), ''),
      include: ['**/*.test.ts'],
      exclude: ['**/node_modules/**'],
      reporters: process.env.GITHUB_ACTIONS ? ['github-actions'] : ['default'],
      coverage: {
        enabled: true,
        reporter: process.env.GITHUB_ACTIONS ? ['text'] : ['html'],
      },
    },
  };
});
