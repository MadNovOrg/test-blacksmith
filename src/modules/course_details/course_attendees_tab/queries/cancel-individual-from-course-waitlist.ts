import { gql } from 'graphql-request'

export const CANCEL_INDIVIDUAL_FROM_COURSE_WAITLIST_MUTATION = gql`
  mutation CancelIndividualFromCourseWaitlist(
    $courseId: Int!
    $waitlistId: uuid!
  ) {
    cancelIndividualFromCourseWaitlist(
      input: { courseId: $courseId, waitlistId: $waitlistId }
    ) {
      success
      error
    }
  }
`
