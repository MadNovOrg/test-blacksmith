import { devtoolsExchange } from '@urql/devtools'
import { authExchange } from '@urql/exchange-auth'
import { createClient as createWSClient } from 'graphql-ws'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  makeOperation,
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
  Provider,
} from 'urql'

import { useAuth } from '@app/context/auth'

export const GQLProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { getJWT, queryRole } = useAuth()
  const location = useLocation()

  const wsClient = createWSClient({
    url: import.meta.env.VITE_HASURA_WS_GRAPHQL_API,
    connectionParams: async () => {
      const token = await getJWT()

      return {
        headers: {
          ...(queryRole ? { 'X-Hasura-Role': queryRole } : undefined),
          Authorization: `Bearer ${token}`,
        },
      }
    },
  })

  const client = useMemo(() => {
    return createClient({
      url: import.meta.env.VITE_HASURA_GRAPHQL_API,
      fetchOptions: {
        headers: {
          ...(queryRole ? { 'X-Hasura-Role': queryRole } : undefined),
        },
      },
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        authExchange({
          getAuth: getJWT,
          didAuthError: ({ error }) => {
            return error.graphQLErrors.some(
              e => e.extensions?.code === 'invalid-jwt'
            )
          },
          addAuthToOperation({ operation, authState }) {
            if (!authState) {
              return operation
            }

            const fetchOptions =
              typeof operation.context.fetchOptions === 'function'
                ? operation.context.fetchOptions()
                : operation.context.fetchOptions || {}

            let headers = {
              ...fetchOptions.headers,
            }

            // only add "Authorization" to headers if the page is not Course Invitation Page
            if (location.pathname !== '/invitation') {
              Object.assign(headers, {
                Authorization: `Bearer ${authState}`,
              })
            } else {
              // revert headers for all requests when page is Course Invitation Page
              // to avoid having "Authorization" and keep only the headers coming for those requests
              headers = {
                ...fetchOptions.headers,
              }
            }

            return makeOperation(operation.kind, operation, {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers,
              },
            })
          },
        }),
        fetchExchange,
        subscriptionExchange({
          forwardSubscription(request) {
            const input = { ...request, query: request.query || '' }
            return {
              subscribe(sink) {
                const unsubscribe = wsClient.subscribe(input, sink)
                return { unsubscribe }
              },
            }
          },
        }),
      ],
    })
  }, [queryRole, getJWT, location.pathname, wsClient])

  return <Provider value={client}>{children}</Provider>
}
