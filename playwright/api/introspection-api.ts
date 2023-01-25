import { gql, GraphQLClient } from 'graphql-request'

import { HASURA_BASE_URL, HASURA_SECRET } from '../constants'

const endpoint = `${HASURA_BASE_URL}/v1/graphql`
const headers = {
  'x-hasura-admin-secret': HASURA_SECRET,
}

const graphQLClient = new GraphQLClient(endpoint, {})

const INTROSPECTION_QUERY = gql`
  query Introspection {
    __schema {
      mutationType {
        fields {
          name
        }
      }

      queryType {
        fields {
          name
        }
      }
    }
  }
`

export async function introspection(
  role:
    | 'anonymous'
    | 'unverified'
    | 'user'
    | 'trainer'
    | 'ld'
    | 'sales-admin'
    | 'tt-ops'
    | 'tt-admin'
) {
  return graphQLClient.request<{
    __schema: {
      mutationType: {
        fields: { name: string }[]
      }
      queryType: {
        fields: { name: string }[]
      }
    }
  }>(
    INTROSPECTION_QUERY,
    {},
    {
      ...headers,
      'x-hasura-role': role,
    }
  )
}
