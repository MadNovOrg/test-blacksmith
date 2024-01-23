import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RecreateCourseInvite(
    $inviteId: uuid!
    $courseId: Int
    $email: String
    $expiresIn: timestamptz
  ) {
    delete_course_invites_by_pk(id: $inviteId) {
      id
    }
    insert_course_invites_one(
      object: { course_id: $courseId, email: $email, expiresIn: $expiresIn }
    ) {
      id
    }
  }
`
