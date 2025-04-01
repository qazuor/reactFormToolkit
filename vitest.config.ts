import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/tests/setupTest.ts'],
            include: ['src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            testTimeout: 1000,
            css: true,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html']
            }
        }
    })
);
