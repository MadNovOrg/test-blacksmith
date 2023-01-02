import {
  ClientError,
  GraphQLClient,
  RequestDocument,
  Variables,
} from 'graphql-request'

import { GqlError, RoleName } from '@app/types'

const graphqlClient = new GraphQLClient(import.meta.env.VITE_HASURA_GRAPHQL_API)

type Opts = { token?: string; role?: RoleName; headers?: HeadersInit }

export async function gqlRequest<T, V = Variables>(
  query: RequestDocument,
  variables?: V,
  { token, role, headers }: Opts = {}
): Promise<T> {
  const requestHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : undefined),
    ...(role ? { 'X-Hasura-Role': role } : undefined),
    ...headers,
  }

  return graphqlClient
    .request(query, variables, requestHeaders)
    .catch((e: ClientError) => Promise.reject(normalizeGqlError(e)))
}

export function normalizeGqlError(error: ClientError): GqlError | null {
  if (!error) return null

  const { message, extensions } = error.response?.errors?.[0] || {}
  return { message: message ?? '', ...extensions }
}
