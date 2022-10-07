import { gql } from 'graphql-request'

export const CANCEL_COURSE_MUTATION = gql`
  mutation CancelCourse(
    $courseId: Int!
    $cancellationFeePercent: Int
    $cancellationReason: String!
  ) {
    cancelledCourse: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: {
        status: CANCELLED
        cancellationFeePercent: $cancellationFeePercent
        cancellationReason: $cancellationReason
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
