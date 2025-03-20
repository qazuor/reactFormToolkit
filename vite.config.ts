import { resolve } from 'node:path';
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	},
	plugins: [
		react(),
		dts({
			include: ["src/**/*"],
			exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		}),
	],
});
