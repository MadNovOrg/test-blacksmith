import { gql } from 'graphql-request'

import { Venue } from '@app/types'
import { VENUE } from '@app/queries/fragments'

export type ParamsType = {
  venue: Omit<Venue, 'id'>
}

export type ResponseType = {
  venue: Venue
}

export const MUTATION = gql`
  ${VENUE}
  mutation InsertVenue($venue: venue_insert_input!) {
    venue: insert_venue_one(object: $venue) {
      ...Venue
    }
  }
`
