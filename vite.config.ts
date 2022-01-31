import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
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
  ],
})
