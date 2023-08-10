import { gql } from 'graphql-request'

export const CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION = gql`
  mutation CancelIndividualFromCourse(
    $courseId: Int!
    $profileId: uuid!
    $reason: String!
    $fee: Float!
  ) {
    cancelIndividualFromCourse(
      courseId: $courseId
      profileId: $profileId
      reason: $reason
      fee: $fee
    )
  }
`
