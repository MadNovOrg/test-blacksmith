import { gql } from 'graphql-request'

export const CANCEL_MYSELF_FROM_COURSE_WAITLIST_MUTATION = gql`
  mutation CancelMyselfFromCourseWaitlist(
    $courseId: Int!
    $cancellationSecret: uuid!
  ) {
    cancelMyselfFromCourseWaitlist(
      input: { courseId: $courseId, cancellationSecret: $cancellationSecret }
    ) {
      success
      error
    }
  }
`
