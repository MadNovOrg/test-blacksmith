
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

export default function withRouterProvider(Story: any) {
  return (
    <BrowserRouter>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{ updateType: 'replaceIn' }}
      >
        <Story />
      </QueryParamProvider>
    </BrowserRouter>
  )
}

