import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RecreateCourseInvite(
    $inviteId: uuid!
    $courseId: uuid
    $email: String
  ) {
    delete_course_invites_by_pk(id: $inviteId) {
      id
    }
    insert_course_invites_one(object: { course_id: $courseId, email: $email }) {
      id
    }
  }
`
