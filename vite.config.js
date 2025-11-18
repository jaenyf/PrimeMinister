import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        open: true
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: "./tests/setup.js",
        include: ["tests/**/*.test.js"]
    }
});
