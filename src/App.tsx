import { CssBaseline } from '@mui/material'
import React, { useMemo } from 'react'
import { SWRConfig } from 'swr'

import { GQLProvider } from './components/GQLProvider'
import { useFetcher } from './hooks/use-fetcher'
import { AppRoutes } from './routes'

import './style.css'

function App() {
  const fetcher = useFetcher()

  const config = useMemo(
    () => ({
      fetcher,
      onError: () => console.error('fetcher error, check network tab'),
    }),
    [fetcher]
  )

  return (
    <GQLProvider>
      <SWRConfig value={config}>
        <CssBaseline />
        <AppRoutes />
      </SWRConfig>
    </GQLProvider>
  )
}

export default App
