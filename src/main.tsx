import { ThemeProvider } from '@mui/material/styles'
import { ExtraErrorData as ExtraErrorDataIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import { Amplify } from 'aws-amplify'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import TagManager from 'react-gtm-module'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import { AuthProvider } from '@app/context/auth'

import './i18n/config'

import App from './App'
import { ErrorPage } from './components/ErrorPage'
import theme from './theme'

import.meta.env.VITE_APP_VERSION
  ? console.info(`App version is ${import.meta.env.VITE_APP_VERSION}`)
  : null

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new ExtraErrorDataIntegration(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACING_SAMPLE_RATE),
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  denyUrls: [/localhost/i, /127.0.0.1/],
  replaysSessionSampleRate: Number(
    import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
  ),
  replaysOnErrorSampleRate: Number(
    import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE
  ),
})

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  },
})

TagManager.initialize({ gtmId: import.meta.env.VITE_GTM_ID })

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('app')!)

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      }}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <QueryParamProvider
            adapter={ReactRouter6Adapter}
            options={{ updateType: 'replaceIn' }}
          >
            <Sentry.ErrorBoundary
              fallback={errorData => (
                <ErrorPage
                  errorData={errorData}
                  debug={
                    import.meta.env.VITE_SENTRY_ENVIRONMENT === 'development'
                  }
                />
              )}
            >
              <AuthProvider>
                <App />
              </AuthProvider>
            </Sentry.ErrorBoundary>
          </QueryParamProvider>
        </BrowserRouter>
      </ThemeProvider>
    </PostHogProvider>
  </React.StrictMode>
)
