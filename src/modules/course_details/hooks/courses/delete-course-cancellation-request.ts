import { gql } from 'graphql-request'

export const DELETE_COURSE_CANCELLATION_REQUEST_MUTATION = gql`
  mutation DeleteCourseCancellationRequest($id: uuid!) {
    delete_course_cancellation_request_by_pk(id: $id) {
      id
    }
  }
`
