import { useFeatureFlagEnabled } from 'posthog-js/react'

import { useAuth } from '@app/context/auth'
import { Splash_Screens_Enum } from '@app/generated/graphql'

const SPLASH_SCREEN_FEATURE_FLAGS: Record<Splash_Screens_Enum, string> = {
  [Splash_Screens_Enum.OrganisationsInsightReports]:
    'insights-report-splash-screen',
}

export const useIsProfileSplashScreenPassed = (
  splashScreen: Splash_Screens_Enum,
) => {
  const { profile } = useAuth()

  const isSplashScreenFeatureFlagEnabled = useFeatureFlagEnabled(
    SPLASH_SCREEN_FEATURE_FLAGS[splashScreen],
  )

  if (!profile || !isSplashScreenFeatureFlagEnabled || !profile.splashScreens)
    return true

  const profileSplashScreen = profile.splashScreens.find(
    screen => screen.splash_screen === splashScreen,
  )

  return Boolean(profileSplashScreen)
}
