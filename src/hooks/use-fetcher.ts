import { RequestDocument, Variables } from 'graphql-request'
import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import { gqlRequest } from '@app/lib/gql-request'

export type Fetcher = ReturnType<typeof useFetcher>

export const useFetcher = () => {
  const { getJWT, queryRole } = useAuth()

  return useCallback(
    async function <T, V = Variables>(
      query: RequestDocument,
      variables?: V
    ): Promise<T> {
      const token = await getJWT()
      return gqlRequest(query, variables, { token, role: queryRole })
    },
    [getJWT, queryRole]
  )
}

export const useSWRFetcher = () => {
  const { getJWT, queryRole } = useAuth()

  return useCallback(
    async function <T, V = Variables>(
      params: [query: RequestDocument, variables?: V] | RequestDocument
    ): Promise<T> {
      const [query, variables] = Array.isArray(params) ? params : [params, {}]

      const token = await getJWT()
      return gqlRequest(query, variables, { token, role: queryRole })
    },
    [getJWT, queryRole]
  )
}
