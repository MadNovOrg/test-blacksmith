import { gql } from 'graphql-request'

export const CANCEL_COURSE_MUTATION = gql`
  mutation CancelCourse(
    $courseId: Int!
    $cancellationFee: Float
    $cancellationReason: String!
    $cancellationFeeType: course_cancellation_fee_type_enum
  ) {
    cancelledCourse: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: {
        status: CANCELLED
        cancellationFee: $cancellationFee
        cancellationReason: $cancellationReason
        cancellationFeeType: $cancellationFeeType
      }
    ) {
      id
    }
    delete_course_cancellation_request(
      where: { course_id: { _eq: $courseId } }
    ) {
      affected_rows
    }
  }
`
