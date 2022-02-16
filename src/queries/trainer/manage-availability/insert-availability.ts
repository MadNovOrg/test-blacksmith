import { gql } from 'graphql-request'

import { Availability } from '@app/types'
import { AVAILABILITY } from '@app/queries/fragments'

export type ResponseType = Availability

export type ParamsType = {
  event: Omit<Availability, 'id' | 'createdAt' | 'updatedAt'>
}

export const MUTATION = gql`
  ${AVAILABILITY}
  mutation insertAvailability($event: availability_insert_input!) {
    insert_availability(objects: [$event]) {
      returning {
        ...Availability
      }
    }
  }
`
