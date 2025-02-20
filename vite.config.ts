import path from 'path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const proxyTarget =
    env.VITE_AWS_REGION === 'ap-southeast-2'
      ? 'http://localhost:8081'
      : 'http://localhost:8080'

  return {
    server: {
      proxy: {
        '/v1/graphql': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
      port: 3000,
      headers: {
        'Strict-Transport-Security':
          'max-age=31536000; includeSubDomains; preload', // see https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
        'Content-Security-Policy': `"
          default-src 'self';
          script-src 'self' 'unsafe-inline'
            https://www.google.com/recaptcha 
            https://www.gstatic.com/recaptcha 
            https://js.stripe.com 
            https://www.googletagmanager.com 
            https://cognito-idp.eu-west-2.amazonaws.com 
            https://cognito-idp.ap-southeast-2.amazonaws.com 
            https://maps.googleapis.com 
            https://maps.gstatic.com 
            https://places.googleapis.com 
            https://ajax.googleapis.com 
            https://eu-assets.i.posthog.com 
            https://eu.i.posthog.com 
            http://js-eu1.hs-scripts.com 
            https://js-eu1.hs-banner.com 
            https://js-eu1.hs-analytics.net 
            https://js-eu1.usemessages.com 
            https://track-eu1.hubspot.com 
            https://flagcdn.com 
            https://cdn-kh.teamteach.com 
            https://cdn.mouseflow.com;
          style-src 'self' 'unsafe-inline' 
            https://fonts.googleapis.com;
          img-src 'self'
            https://cdn-kh.teamteach.com 
            https://track-eu1.hubspot.com 
            https://maps.googleapis.com 
            https://maps.gstatic.com 
            https://places.googleapis.com 
            https://flagcdn.com 
            https://www.google.com/recaptcha 
            https://cdn.jsdelivr.net 
            data: image/svg+xml;
          font-src 'self'
            https://fonts.gstatic.com 
            https://fonts.googleapis.com 
            https://cdn-kh.teamteach.com 
            data: application/font-woff;
          connect-src 'self'
            https://track-eu1.hubspot.com 
            https://flagcdn.com 
            https://cognito-idp.eu-west-2.amazonaws.com 
            https://cognito-idp.ap-southeast-2.amazonaws.com 
            https://maps.googleapis.com 
            https://maps.gstatic.com 
            https://places.googleapis.com 
            https://api.google.com 
            https://eu.i.posthog.com 
            https://cdn-kh.teamteach.com 
            https://api-eu1.hubspot.com;"`.replace(/\s{2,}/g, ' '),
        // https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
        'X-Frame-Options': 'DENY', //https://pragmaticwebsecurity.com/articles/securitypolicies/preventing-framing-with-policies.html
        'X-Content-Type-Options': 'nosniff', //https://fetch.spec.whatwg.org/#ref-for-determine-nosniff
        'Referrer-Policy': 'strict-origin-when-cross-origin', //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#strict-origin-when-cross-origin_2
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()', //https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy#browser_compatibility
      },
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
        reporter: ['json', 'text-summary', 'html', 'cobertura'],
        include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reportsDirectory: './coverage',
      },
      cache: {
        dir: '../../node_modules/.vitest',
      },
    },
  }
})
