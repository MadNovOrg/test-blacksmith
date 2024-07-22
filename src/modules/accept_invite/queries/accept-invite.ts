import { gql } from 'urql'

export const ACCEPT_INVITE_MUTATION = gql`
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
