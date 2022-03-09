import {
  ClientError,
  GraphQLClient,
  RequestDocument,
  Variables,
} from 'graphql-request'

import { GqlError } from '@app/types'

const graphqlClient = new GraphQLClient(import.meta.env.VITE_HASURA_GRAPHQL_API)

export function normalizeGqlError(error: ClientError): GqlError | null {
  if (!error) return null

  const { message, extensions } = error.response?.errors?.[0] || {}
  return { message, ...extensions }
}

export async function gqlRequest<T, V = Variables>(
  query: RequestDocument,
  variables?: V,
  token?: string,
  authHeader = 'authorization'
): Promise<T> {
  return graphqlClient
    .request(
      query,
      variables,
      token ? { [authHeader]: `Bearer ${token}` } : undefined
    )
    .catch((e: ClientError) => Promise.reject(normalizeGqlError(e)))
}
