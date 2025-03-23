import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    outExtension: ({ format }) => ({
        js: format === 'cjs' ? '.cjs' : '.js'
    }),
    dts: true,
    splitting: true,
    sourcemap: !options.watch,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom'],
    alias: { '@': resolve(__dirname, './src') },
    async onSuccess() {
        // Copy animations.css to dist
        await import('fs/promises').then(fs =>
            fs.copyFile('src/styles/animations.css', 'dist/animations.css')
        );
    }
}));
