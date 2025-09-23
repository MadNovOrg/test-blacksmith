import { gql, GraphQLClient } from 'graphql-request'

import { RoleName } from '@app/types'

import { HASURA_BASE_URL, HASURA_SECRET } from '@qa/constants'

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

      types {
        name
        fields {
          name
          args {
            name
          }
        }
        inputFields {
          name
        }
      }
    }
  }
`

export async function introspection(role: `${RoleName}` | 'anonymous') {
  return graphQLClient.request<{
    __schema: {
      mutationType: {
        fields: { name: string }[]
      }
      queryType: {
        fields: { name: string }[]
      }
      types: {
        name: string
        fields: {
          name: string
          args: {
            name: string
          }[]
        }[]
        inputFields: {
          name: string
        }[]
      }[]
    }
  }>(
    INTROSPECTION_QUERY,
    {},
    {
      ...headers,
      'x-hasura-role': role,
    },
  )
}
