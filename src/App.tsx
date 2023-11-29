import { CssBaseline } from '@mui/material'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { SWRConfig } from 'swr'

import { GQLProvider } from './components/GQLProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { SnackbarProvider } from './context/snackbar'
import { useSWRFetcher } from './hooks/use-fetcher'
import { AppRoutes } from './routes'

import './style.css'

function App() {
  const fetcher = useSWRFetcher()
  const { t } = useTranslation()

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
      <GQLProvider>
        <SWRConfig value={config}>
          <>
            <CssBaseline />
            <SnackbarProvider>
              <ScrollToTop />
              <Helmet
                defaultTitle={t('pages.browser-tab-titles.main-title')}
                titleTemplate={`%s - ${t(
                  'pages.browser-tab-titles.main-title'
                )}`}
              />
              <AppRoutes />
            </SnackbarProvider>
          </>
        </SWRConfig>
      </GQLProvider>
    </>
  )
}

export default App
