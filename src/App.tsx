import React from 'react'
import { SWRConfig } from 'swr'
import { RequestDocument, GraphQLClient, Variables } from 'graphql-request'

import { AppRoutes } from './AppRoutes'
import { useAuth } from './context/auth'

const graphqlClient = new GraphQLClient(import.meta.env.VITE_HASURA_GRAPHQL_API)

export async function fetcher<T>(
  query: RequestDocument,
  variables: Variables,
  token?: string
): Promise<T> {
  return graphqlClient.request(query, variables, {
    Authorization: `Bearer ${token}`,
  })
}

function App() {
  const auth = useAuth()
  const config = {
    fetcher: function <T>(
      query: RequestDocument,
      variables: Variables
    ): Promise<T> {
      return fetcher(query, variables, auth.idToken)
    },
    onError: (e: string) => console.error('fetcher error', e),
  }

  return (
    <SWRConfig value={config}>
      <AppRoutes />
    </SWRConfig>
  )
}

export default App
