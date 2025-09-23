import { useContext } from 'react'

import { ResourcePacksPricingContext } from '.'

export function useResourcePacksPricingContext() {
  const value = useContext(ResourcePacksPricingContext)

  if (value === undefined) {
    throw new Error(
      'useResourcePacksPricingContext must be used within a ResourcePacksPricingProvider',
    )
  }

  return value
}
