// frontend/vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.js",
        include: ["src/**/*.test.{js,jsx}", "src/**/__tests__/*.{js,jsx}"]
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react"
    }
    });
