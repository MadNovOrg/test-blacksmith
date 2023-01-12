import { RequestDocument, Variables } from 'graphql-request'
import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import { gqlRequest } from '@app/lib/gql-request'

export type Fetcher = ReturnType<typeof useFetcher>

export const useFetcher = () => {
  const { getJWT, activeRole } = useAuth()

  return useCallback(
    async function <T, V = Variables>(
      query: RequestDocument,
      variables?: V
    ): Promise<T> {
      const token = await getJWT()
      return gqlRequest(query, variables, { token, role: activeRole })
    },
    [getJWT, activeRole]
  )
}

export const useSWRFetcher = () => {
  const { getJWT, activeRole } = useAuth()

  return useCallback(
    async function <T, V = Variables>(
      params: [query: RequestDocument, variables?: V] | RequestDocument
    ): Promise<T> {
      const [query, variables] = Array.isArray(params) ? params : [params, {}]

      const token = await getJWT()
      console.log({ query, variables })
      return gqlRequest(query, variables, { token, role: activeRole })
    },
    [getJWT, activeRole]
  )
}
