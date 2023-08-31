import { devtoolsExchange } from '@urql/devtools'
import { authExchange } from '@urql/exchange-auth'
import React, { useMemo } from 'react'
import {
  makeOperation,
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
} from 'urql'

import { useAuth } from '@app/context/auth'

export const GQLProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { getJWT, queryRole } = useAuth()

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

            return makeOperation(operation.kind, operation, {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  Authorization: `Bearer ${authState}`,
                },
              },
            })
          },
        }),
        fetchExchange,
      ],
    })
  }, [queryRole, getJWT])

  return <Provider value={client}>{children}</Provider>
}
