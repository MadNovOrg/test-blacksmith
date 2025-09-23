import * as Sentry from '@sentry/react'
import { useEffect } from 'react'

import { useAuth } from '@app/context/auth'

export function useConfigureSentryTags() {
  const { profile, activeRole } = useAuth()

  useEffect(() => {
    Sentry.setTag('hub:active_role', activeRole)
    Sentry.setTag('hub:profile_id', profile?.id)
  }, [profile?.id, activeRole])

  return null
}
