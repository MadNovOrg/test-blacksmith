import { GraphQLClient, RequestDocument, Variables } from 'graphql-request'

const graphqlClient = new GraphQLClient(import.meta.env.VITE_HASURA_GRAPHQL_API)

export async function gqlRequest<T, V = Variables>(
  query: RequestDocument,
  variables?: V,
  token?: string
): Promise<T> {
  return graphqlClient.request(
    query,
    variables,
    token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined
  )
}
