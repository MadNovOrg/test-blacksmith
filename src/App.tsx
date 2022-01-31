import React from 'react'
import Amplify from 'aws-amplify'

import { AppRoutes } from './AppRoutes'
import SessionProvider from './auth'

import './style.css'

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  },
})

function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  )
}

export default App
