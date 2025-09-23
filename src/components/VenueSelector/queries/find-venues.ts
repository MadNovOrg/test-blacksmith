import { gql } from 'graphql-request'

import { VENUE } from '@app/queries/fragments'

export const FIND_VENUES = gql`
  ${VENUE}
  query FindVenues($query: String!, $country: [String!]) {
    venues: venue(
      where: {
        _and: [
          {
            _or: [
              { name: { _ilike: $query } }
              { city: { _ilike: $query } }
              { addressLineOne: { _ilike: $query } }
              { addressLineTwo: { _ilike: $query } }
              { postCode: { _ilike: $query } }
            ]
          }
          { countryCode: { _in: $country } }
        ]
      }
    ) {
      ...Venue
    }
  }
`
