import { CssBaseline } from '@mui/material'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { SWRConfig } from 'swr'

import { GQLProvider } from './components/GQLProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { useAuth } from './context/auth'
import { SnackbarProvider } from './context/snackbar'
import { useSWRFetcher } from './hooks/use-fetcher'
import { AppRoutes } from './routes'

import './style.css'

function App() {
  const fetcher = useSWRFetcher()
  const { pathname } = useLocation()
  const { profile } = useAuth()

  const config = useMemo(
    () => ({
      fetcher,
      onError: (err: Error) => {
        console.error(err)
        console.error('fetcher error, check network tab')
      },
    }),
    [fetcher]
  )
  return (
    <>
      {import.meta.env.MODE === 'production' &&
      pathname === '/' &&
      !!profile ? (
        <>{window.location.replace(import.meta.env.VITE_KNOWLEDGE_HUB_HOME)}</>
      ) : (
        <GQLProvider>
          <SWRConfig value={config}>
            <CssBaseline />
            <SnackbarProvider>
              <ScrollToTop />
              <AppRoutes />
            </SnackbarProvider>
          </SWRConfig>
        </GQLProvider>
      )}
    </>
  )
}

export default App
