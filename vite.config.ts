/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('xlsx')) {
            return 'vendor-xlsx'
          }

          if (id.includes('jspdf') || id.includes('jspdf-autotable')) {
            return 'vendor-pdf'
          }

          if (
            id.includes('@mantine')
            || id.includes('@tabler')
            || id.includes('@emotion')
            || id.includes('@floating-ui')
            || id.includes('dayjs')
          ) {
            return 'vendor-mantine'
          }

          if (id.includes('@ionic') || id.includes('ionicons')) {
            return 'vendor-ionic'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }

          return 'vendor-misc'
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
