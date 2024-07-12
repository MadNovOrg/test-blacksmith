import { gql } from 'graphql-request'

export const CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION = gql`
  mutation CancelIndividualFromCourse(
    $courseId: Int!
    $profileId: uuid!
    $reason: String!
    $fee: Float!
    $feeType: CancellationFeeType!
  ) {
    cancelIndividualFromCourse(
      courseId: $courseId
      profileId: $profileId
      reason: $reason
      fee: $fee
      feeType: $feeType
    )
  }
`
