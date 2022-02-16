import { gql } from 'graphql-request'

import { AVAILABILITY } from '@app/queries/fragments'
import { Availability } from '@app/types'

export type ResponseType = { events: Availability[] }

export const QUERY = gql`
  ${AVAILABILITY}
  query GetAvailability {
    events: availability {
      ...Availability
    }
  }
`
