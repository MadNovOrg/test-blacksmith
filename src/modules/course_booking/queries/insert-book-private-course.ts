import { gql } from 'graphql-request'

export default gql`
  mutation BookPrivateCourse($booking: private_course_booking_insert_input!) {
    insert_private_course_booking(objects: [$booking]) {
      affected_rows
    }
  }
`
