import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ['@qazuor/react-form-toolkit']
    },
    plugins: [
        react()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        preserveSymlinks: true
    },
    publicDir: path.resolve(__dirname, '../docs'),
    assetsInclude: ['**/*.md']
});
