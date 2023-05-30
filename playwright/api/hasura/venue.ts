import { gql } from 'graphql-request'

import { getClient } from './client'

export const getVenueId = async (name: string): Promise<string> => {
  const query = gql`query VenueByName { venue(where: {name: {_eq: "${name}"}}) { id }}`
  const response: { venue: { id: string }[] } = await getClient().request(query)
  return response.venue[0].id
}
