import { GraphQLClient, Variables } from 'graphql-request'
import { TypedDocumentNode } from 'urql'

import { HASURA_BASE_URL, HASURA_SECRET } from '@qa/constants'

export type HasuraRole =
  | 'anonymous'
  | 'unverified'
  | 'user'
  | 'trainer'
  | 'ld'
  | 'finance'
  | 'sales-admin'
  | 'sales-representative'
  | 'tt-ops'
  | 'tt-admin'

export async function runQueryAsRole<T>(
  query: string | TypedDocumentNode,
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
