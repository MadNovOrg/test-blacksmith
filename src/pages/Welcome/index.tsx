import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'

import { WelcomeV1 } from './WelcomeV1'
import { WelcomeV2 } from './WelcomeV2'

export const Welcome: React.FC<React.PropsWithChildren<unknown>> = () => {
  const showNewWelcomePage = useFeatureFlagEnabled('new-welcome-page')

  if (typeof showNewWelcomePage === 'undefined') {
    return null
  }

  return showNewWelcomePage ? <WelcomeV2 /> : <WelcomeV1 />
}
