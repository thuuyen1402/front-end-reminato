import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
const testConfig = defineConfig({
    ...viteConfig({ mode: "test" }),
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/setup-vitest.ts'],
    },
})

export default testConfig