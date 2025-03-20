import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    dts: true,
    splitting: true,
    sourcemap: !options.watch,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom'],
    alias: { '@': resolve(__dirname, './src') }
}));
