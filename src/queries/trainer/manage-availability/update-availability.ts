import { gql } from 'graphql-request'

import { AVAILABILITY } from '@app/queries/fragments'
import { Availability } from '@app/types'

export type ResponseType = Availability

export type ParamsType = {
  id: string
  event: Omit<Availability, 'id' | 'createdAt' | 'updatedAt'>
}

export const MUTATION = gql`
  ${AVAILABILITY}
  mutation updateAvailability($id: uuid!, $event: availability_set_input!) {
    update_availability(where: { id: { _eq: $id } }, _set: $event) {
      returning {
        ...Availability
      }
    }
  }
`
