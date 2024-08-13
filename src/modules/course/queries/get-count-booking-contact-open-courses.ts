import { gql } from 'urql'

export const GET_BOOKING_CONTACT_COUNT_OPEN_COURSES = gql`
  query GetCountBookingContactOpenCourses($bookingContactEmail: String!) {
    course_aggregate(
      where: {
        participants: {
          order: {
            bookingContact: { _contains: { email: $bookingContactEmail } }
          }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
