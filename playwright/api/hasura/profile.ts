import { gql } from 'graphql-request'

import { getClient } from './client'

export const getProfileId = async (email: string): Promise<string> => {
  const query = gql`query ProfileByEmail { profile(where: {email: {_eq: "${email}"}}) { id }}`
  const response: { profile: { id: string }[] } = await getClient().request(
    query
  )
  return response.profile[0].id
}
