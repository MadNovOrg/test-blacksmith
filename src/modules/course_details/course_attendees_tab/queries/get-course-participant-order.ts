import { gql } from 'graphql-request'

export const GET_PARTICIPANT_ORDER = gql`
  query GetCourseParticipantOrder($id: uuid!) {
    participant: course_participant_by_pk(id: $id) {
      order {
        xeroInvoiceNumber
        id
      }
    }
  }
`
