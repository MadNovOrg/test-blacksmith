import { GraphQLClient } from 'graphql-request'

import { HASURA_BASE_URL, HASURA_SECRET } from '../../constants'

const endpoint = `${HASURA_BASE_URL}/v1/graphql`

let graphQLClient: GraphQLClient
export const getClient = () => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET,
      },
    })
  }
  return graphQLClient
}
