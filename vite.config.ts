import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ["src/**/*"],
			exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		}),
	],
});
