import React, { useMemo } from 'react'
import { SWRConfig } from 'swr'

import { AppRoutes } from './AppRoutes'
import { useFetcher } from './hooks/use-fetcher'

function App() {
  const fetcher = useFetcher()

  const config = useMemo(
    () => ({
      fetcher,
      onError: (e: string) => console.error('fetcher error', e),
    }),
    [fetcher]
  )

  return (
    <SWRConfig value={config}>
      <AppRoutes />
    </SWRConfig>
  )
}

export default App
