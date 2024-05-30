import path from 'path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

const TARGET_ENV = (process.env.TARGET ?? 'local').toLowerCase()

// since we don't have BE local on github actions, and some e2e tests require BE
// this will ensure that the browser playwright is using, will target BE from DEV env
const TARGET_HASURA_ENDPOINT =
  TARGET_ENV === 'github'
    ? 'https://hasura.dev.teamteachhub.co.uk'
    : 'http://localhost:8080'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/v1/graphql': {
        target: TARGET_HASURA_ENDPOINT,
        changeOrigin: true,
      },
    },
    port: 3000,
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      // see https://github.com/aws-amplify/amplify-ui/issues/268
      // and https://ui.docs.amplify.aws/getting-started/installation?platform=vue
      './runtimeConfig': './runtimeConfig.browser',
      '@test': path.resolve(__dirname, 'test'),
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
    sentryVitePlugin({
      org: 'team-teach-ltd',
      project: 'team-teach-hub',
    }),
  ],
  test: {
    globals: true,
    testTimeout: 50000,
    environment: 'jsdom',
    globalSetup: './test/vitest-global.ts',
    setupFiles: './test/vitest-setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default', 'html'],
    coverage: {
      reporter: ['json', 'text-summary'],
      include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reportsDirectory: './coverage',
    },
    cache: {
      dir: '../../node_modules/.vitest',
    },
  },
})
