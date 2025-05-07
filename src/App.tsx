import { CssBaseline } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { GQLProvider } from './components/GQLProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { UpdateVersionBanner } from './components/UpdateVersionBanner'
import { SnackbarProvider } from './context/snackbar'
import { useConfigureSentryTags } from './hooks/useConfigureSentryTags'
import { GTMPageTracker } from './lib/tag-manager'
import { AppRoutes } from './routes'
import './style.css'

function App() {
  const { t } = useTranslation()

  useConfigureSentryTags()

  return (
    <GQLProvider>
      <>
        <CssBaseline />
        <SnackbarProvider>
          <UpdateVersionBanner />
          <ScrollToTop />
          <Helmet
            defaultTitle={t('pages.browser-tab-titles.main-title')}
            titleTemplate={`%s - ${t('pages.browser-tab-titles.main-title')}`}
          />
          <GTMPageTracker />
          <AppRoutes />
        </SnackbarProvider>
      </>
    </GQLProvider>
  )
}

export default App
