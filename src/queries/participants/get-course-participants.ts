import { gql } from 'graphql-request'

import { CourseParticipant, SortOrder } from '@app/types'

export type ResponseType = {
  courseParticipants: CourseParticipant[]
  courseParticipantsAggregation: { aggregate: { count: number } }
}

export type ParamsType = {
  courseId: string
  limit?: number
  offset?: number
  orderBy: Record<string, SortOrder>
}

export const QUERY = gql`
  query CourseParticipants(
    $courseId: uuid!
    $limit: Int
    $offset: Int
    $orderBy: [course_participant_order_by!] = { firstName: asc, lastName: asc }
  ) {
    courseParticipants: course_participant(
      where: { course_id: { _eq: $courseId } }
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      firstName
      lastName
      invoiceID
      bookingDate
      organization {
        name
      }
      contactDetails
    }
    courseParticipantsAggregation: course_participant_aggregate(
      where: { course_id: { _eq: $courseId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
