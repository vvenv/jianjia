import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'template',
      formats: ['es', 'umd'],
      fileName: 'template',
    },
    minify: false,
  },
  plugins: [dts({ rollupTypes: true })],
})
