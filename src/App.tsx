import { CssBaseline, ThemeProvider } from '@mui/material'
import React, { useMemo } from 'react'
import { SWRConfig } from 'swr'

import { AppRoutes } from './AppRoutes'
import { useFetcher } from './hooks/use-fetcher'
import theme from './theme'

import './style.css'

function App() {
  const fetcher = useFetcher()

  const config = useMemo(
    () => ({
      fetcher,
      onError: (e: string) => console.error('fetcher error', e),
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
