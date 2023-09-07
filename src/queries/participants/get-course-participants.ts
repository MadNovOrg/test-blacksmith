import { gql } from 'graphql-request'

import {
  CERTIFICATE,
  CERTIFICATE_CHANGELOG,
  COURSE,
  ORDER,
} from '@app/queries/fragments'
import { CourseParticipant, SortOrder } from '@app/types'

export type ResponseType = {
  courseParticipants: CourseParticipant[]
  courseParticipantsAggregation: { aggregate: { count: number } }
}

export const Matcher = /query CourseParticipants/i

export type ParamsType = {
  limit?: number
  offset?: number
  orderBy:
    | { profile: Record<'fullName', SortOrder> }
    | { profile: { email: SortOrder } }
    | { go1EnrolmentStatus: SortOrder }
  where?: object
  withOrder?: boolean
}

export const QUERY = gql`
  ${COURSE}
  ${ORDER}
  ${CERTIFICATE}
  ${CERTIFICATE_CHANGELOG}
  query CourseParticipants(
    $limit: Int
    $offset: Int
    $orderBy: [course_participant_order_by!] = { profile: { fullName: asc } }
    $where: course_participant_bool_exp = {}
    $withOrder: Boolean = false
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
        id
        fullName
        avatar
        archived
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
      go1EnrolmentProgress
      grade
      healthSafetyConsent
      certificate {
        ...Certificate
      }
      order @include(if: $withOrder) {
        ...Order
      }
      course {
        ...Course
        accreditedBy
        bildStrategies {
          id
          strategyName
        }
        organization {
          name
          id
        }
      }
      certificateChanges(order_by: { createdAt: desc }) {
        ...CertificateChangelog
      }
    }
    courseParticipantsAggregation: course_participant_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
