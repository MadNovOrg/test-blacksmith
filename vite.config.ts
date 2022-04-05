import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import shimReactPdf from 'vite-plugin-shim-react-pdf'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/v1/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      // see https://github.com/aws-amplify/amplify-ui/issues/268
      // and https://ui.docs.amplify.aws/getting-started/installation?platform=vue
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
    shimReactPdf(),
  ],
})
