import { GraphQLClient } from 'graphql-request'

import { HASURA_BASE_URL, HASURA_SECRET, TEST_SETTINGS } from '../../constants'

const endpoint = `${HASURA_BASE_URL}/v1/graphql`

let graphQLClient: GraphQLClient

export const getClient = () => {
  let additionalHeaders = {}
  if (TEST_SETTINGS.role === 'tt-admin') {
    additionalHeaders = {
      'x-hasura-role': 'tt-admin',
      'x-hasura-user-id': '22015a3e-8907-4333-8811-85f782265a63',
      'x-hasura-user-email': 'adm@teamteach.testinator.com',
    }
  }
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET,
        ...additionalHeaders,
      },
    })
  }
  return graphQLClient
}
