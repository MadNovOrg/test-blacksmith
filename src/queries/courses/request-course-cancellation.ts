import { gql } from 'graphql-request'

export const REQUEST_COURSE_CANCELLATION_MUTATION = gql`
  mutation RequestCourseCancellation(
    $cancellationRequest: course_cancellation_request_insert_input!
  ) {
    insert_course_cancellation_request(objects: [$cancellationRequest]) {
      affected_rows
    }
  }
`
