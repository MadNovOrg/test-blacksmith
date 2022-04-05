import { CssBaseline, ThemeProvider } from '@mui/material'
import React, { useMemo } from 'react'
import { SWRConfig } from 'swr'

import { useFetcher } from './hooks/use-fetcher'
import { AppRoutes } from './routes'
import theme from './theme'

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
    <SWRConfig value={config}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </SWRConfig>
  )
}

export default App
