import { useQuery } from 'urql'

import {
  GetCountBookingContactOpenCoursesQuery,
  GetCountBookingContactOpenCoursesQueryVariables,
} from '@app/generated/graphql'

import { GET_BOOKING_CONTACT_COUNT_OPEN_COURSES } from '../queries/get-count-booking-contact-open-courses'

export const useBookingContactCountOpenCourses = ({
  bookingContactEmail,
  pause = true,
}: {
  bookingContactEmail: string
  pause: boolean
}) => {
  const [{ data, fetching }] = useQuery<
    GetCountBookingContactOpenCoursesQuery,
    GetCountBookingContactOpenCoursesQueryVariables
  >({
    query: GET_BOOKING_CONTACT_COUNT_OPEN_COURSES,
    variables: { bookingContactEmail },
    pause,
    requestPolicy: 'cache-and-network',
  })

  return { count: data?.course_aggregate.aggregate?.count ?? 0, fetching }
}
