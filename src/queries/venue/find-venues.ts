import { gql } from 'graphql-request'

import { VENUE } from '@app/queries/fragments'
import { Venue } from '@app/types'

export type ResponseType = {
  venues: Venue[]
}

export type ParamsType = {
  query: string
}

export const FIND_VENUES = gql`
  ${VENUE}
  query FindVenues($query: String!) {
    venues: venue(
      where: {
        _or: [
          { name: { _ilike: $query } }
          { city: { _ilike: $query } }
          { addressLineOne: { _ilike: $query } }
          { addressLineTwo: { _ilike: $query } }
          { postCode: { _ilike: $query } }
        ]
      }
    ) {
      ...Venue
    }
  }
`
