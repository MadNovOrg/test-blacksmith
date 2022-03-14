import { RequestDocument, Variables } from 'graphql-request'
import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'

import { gqlRequest } from '@app/lib/gql-request'

export const useFetcher = () => {
  const auth = useAuth()

  return useCallback(
    function <T, V = Variables>(
      query: RequestDocument,
      variables?: V
    ): Promise<T> {
      return gqlRequest(query, variables, auth.idToken)
    },
    [auth.idToken]
  )
}
