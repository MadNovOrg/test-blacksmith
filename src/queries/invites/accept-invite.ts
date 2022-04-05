import { gql } from 'graphql-request'

import { InviteStatus } from '@app/types'

export type ParamsType = { inviteId: string; courseId: string }

export type ResponseType = {
  acceptInvite: { status: InviteStatus }
  addParticipant: { id: string }
}

export const MUTATION = gql`
  mutation AcceptInvite($inviteId: uuid!, $courseId: Int!) {
    acceptInvite: update_course_invites_by_pk(
      pk_columns: { id: $inviteId }
      _set: { status: ACCEPTED }
    ) {
      status
    }

    addParticipant: insert_course_participant_one(
      object: { course_id: $courseId, invite_id: $inviteId }
    ) {
      id
    }
  }
`
