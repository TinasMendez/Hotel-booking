// frontend/vitest.setup.js
import "@testing-library/jest-dom";

// Minimal mocks for env used by the app
Object.defineProperty(import.meta, "env", {
value: { VITE_API_BASE: "http://localhost:8080/api" }
});
