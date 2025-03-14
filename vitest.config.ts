import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    // environment: "jsdom",
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setupTest.ts'],
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environmentOptions: {
      // Configuración específica para happy-dom
      happyDOM: {
        // Configuración para evitar problemas con i18next
        settings: {
          disableJavaScriptEvaluation: false
        },
      },
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
