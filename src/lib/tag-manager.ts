import { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

export const GTMPageTracker = () => {
  const location = useLocation()
  const { profile } = useAuth()

  useEffect(() => {
    const pagePath =
      window.location.hostname + location.pathname + location.search
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        page: pagePath,
        userId: profile?.id,
      },
    })
  }, [location, profile?.id])

  return null
}
