import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'umd'],
      fileName: 'template',
      name: 'template',
    },
    minify: false,
  },
  plugins: [dts()],
});
