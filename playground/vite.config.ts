import { env } from 'node:process'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      template: '../packages/template/src',
    },
  },
})
