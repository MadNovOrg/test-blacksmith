import { ThemeProvider } from '@mui/material/styles'
import { ExtraErrorData as ExtraErrorDataIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { Amplify } from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from '@app/context/auth'

import './i18n/config'

import App from './App'
import { ErrorPage } from './components/ErrorPage'
import theme from './theme'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing(), new ExtraErrorDataIntegration()],
  tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACING_SAMPLE_RATE),
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  denyUrls: [/localhost/i],
})

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Sentry.ErrorBoundary
          fallback={errorData => (
            <ErrorPage
              errorData={errorData}
              debug={import.meta.env.VITE_SENTRY_ENVIRONMENT === 'development'}
            />
          )}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </Sentry.ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('app')
)
