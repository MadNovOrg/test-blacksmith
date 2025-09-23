import { gql } from 'graphql-request'

import { CourseInvite } from '@app/types'

export type ResponseType = {
  invite: CourseInvite
}

export type ParamsType = { note?: string }

export const DECLINE_INVITE_MUTATION = gql`
  mutation DeclineInvite($note: String) {
    invite: declineInvite(note: $note) {
      status
    }
  }
`
