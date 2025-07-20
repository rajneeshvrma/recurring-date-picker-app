// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Make sure this import exists

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: { // Add this 'test' block for Vitest configuration
    environment: 'jsdom', // Use JSDOM for browser-like environment
    globals: true, // Make describe, it, expect available globally without import
    setupFiles: './setupTests.js', // File for global test setup (like @testing-library/jest-dom)
  },
});