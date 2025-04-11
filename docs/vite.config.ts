import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        'process.env': {}
    },
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
    publicDir: path.resolve(__dirname, './public'),
    assetsInclude: ['**/*.md']
});
