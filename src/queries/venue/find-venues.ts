import { gql } from 'graphql-request'

import { Venue } from '@app/types'
import { VENUE } from '@app/queries/fragments'

export type ResponseType = {
  venues: Venue[]
}

export type ParamsType = {
  query: string
}

export const QUERY = gql`
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
