import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { WelcomeV1 } from './WelcomeV1'
import { WelcomeV2 } from './WelcomeV2'

export const Welcome: React.FC<React.PropsWithChildren<unknown>> = () => {
  const showNewWelcomePage = useFeatureFlagEnabled('new-welcome-page')
  const { t } = useTranslation()

  if (typeof showNewWelcomePage === 'undefined') {
    return null
  }

  return (
    <>
      <Helmet>
        <title>{t('pages.browser-tab-titles.home')}</title>
      </Helmet>
      {showNewWelcomePage ? <WelcomeV2 /> : <WelcomeV1 />}
    </>
  )
}
