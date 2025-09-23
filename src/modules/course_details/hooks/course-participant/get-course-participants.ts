import { gql } from 'urql'

import {
  CERTIFICATE,
  CERTIFICATE_CHANGELOG,
  COURSE,
  ORDER,
} from '@app/queries/fragments'
import { CourseParticipant, SortOrder } from '@app/types'

// TODO || Replace Response Type and Params type with generated types
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
  courseId: number
  withOrder?: boolean
}

export const GET_COURSE_PARTICIPANTS = gql`
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
    $courseId: Int
  ) {
    courseParticipants: course_participant(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      attended
      bookingDate
      certificate {
        ...Certificate
      }
      certificateChanges(order_by: { createdAt: desc }) {
        ...CertificateChangelog
      }
      completed
      completed_evaluation
      course {
        ...Course
        accreditedBy
        bildStrategies {
          id
          strategyName
        }
        organization {
          id
          name
        }
        resourcePacksType
      }
      go1EnrolmentProgress
      go1EnrolmentStarted
      go1EnrolmentStatus
      grade
      healthSafetyConsent
      invoiceID
      order @include(if: $withOrder) {
        ...Order
      }
      profile {
        id
        fullName
        avatar
        archived
        email
        contactDetails
        course_evaluation_answers_aggregate(
          where: { courseId: { _eq: $courseId } }
        ) {
          aggregate {
            count
          }
        }
        organizations {
          organization {
            id
            name
          }
        }
      }
    }

    courseParticipantsAggregation: course_participant_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export const GET_COURSE_PARTICIPANT_BY_PK = gql`
  query CourseParticipantByPK($id: uuid!) {
    courseParticipant: course_participant_by_pk(id: $id) {
      id
      go1EnrolmentId
      profile {
        id
        avatar
        email
        fullName
      }
    }
  }
`
