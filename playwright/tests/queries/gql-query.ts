import { GraphQLClient, Variables } from 'graphql-request'

import { HASURA_BASE_URL, HASURA_SECRET } from '../../constants'

export type HasuraRole =
  | 'anonymous'
  | 'unverified'
  | 'user'
  | 'trainer'
  | 'ld'
  | 'sales-admin'
  | 'tt-ops'
  | 'tt-admin'

export async function runQueryAsRole<T>(
  query: string,
  variables: Variables,
  role: HasuraRole,
  headers?: Variables
) {
  const graphQLClient = new GraphQLClient(`${HASURA_BASE_URL}/v1/graphql`, {
    headers: {
      ...(headers ?? {}),
      'x-hasura-admin-secret': HASURA_SECRET,
      'x-hasura-role': role,
    },
  })

  return graphQLClient.request<T>(query, variables)
}
