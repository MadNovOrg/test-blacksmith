import { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import { useLocation } from 'react-router-dom'

export const GTMPageTracker = () => {
  const location = useLocation()

  useEffect(() => {
    const pagePath =
      window.location.hostname + location.pathname + location.search
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        page: pagePath,
      },
    })
  }, [location])

  return null
}
