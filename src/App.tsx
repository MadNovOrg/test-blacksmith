import { CssBaseline } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { GQLProvider } from './components/GQLProvider'
import { InsightsReportSplashScreen } from './components/InsightsReportSplashScreen'
import { ScrollToTop } from './components/ScrollToTop'
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
          <ScrollToTop />
          <Helmet
            defaultTitle={t('pages.browser-tab-titles.main-title')}
            titleTemplate={`%s - ${t('pages.browser-tab-titles.main-title')}`}
          />
          <GTMPageTracker />
          <AppRoutes />
          <InsightsReportSplashScreen />
        </SnackbarProvider>
      </>
    </GQLProvider>
  )
}

export default App
