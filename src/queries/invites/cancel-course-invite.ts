import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation CancelCourseInvite($inviteId: uuid!) {
    delete_course_invites_by_pk(id: $inviteId) {
      id
    }
  }
`
