import { gql } from 'graphql-request'

import { CERTIFICATE, COURSE } from '@app/queries/fragments'
import { CourseParticipant, SortOrder } from '@app/types'

export type ResponseType = {
  courseParticipants: CourseParticipant[]
  courseParticipantsAggregation: { aggregate: { count: number } }
}

export type ParamsType = {
  limit?: number
  offset?: number
  orderBy:
    | { profile: Record<'fullName', SortOrder> }
    | { profile: { email: SortOrder } }
    | { go1EnrolmentStatus: SortOrder }
  where?: object
}

export const QUERY = gql`
  ${COURSE}
  ${CERTIFICATE}
  query CourseParticipants(
    $limit: Int
    $offset: Int
    $orderBy: [course_participant_order_by!] = { profile: { fullName: asc } }
    $where: course_participant_bool_exp = {}
  ) {
    courseParticipants: course_participant(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      attended
      profile {
        fullName
        email
        contactDetails
        organizations {
          organization {
            id
            name
          }
        }
      }
      invoiceID
      bookingDate
      go1EnrolmentStatus
      grade
      certificate {
        ...Certificate
      }
      course {
        ...Course
      }
    }
    courseParticipantsAggregation: course_participant_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
