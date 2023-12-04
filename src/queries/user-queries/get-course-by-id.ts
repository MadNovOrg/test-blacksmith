import { gql } from 'urql'

import { Course } from '@app/types'

import { COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

// TODO: can't share types as user queries select different columns
export type ResponseType = { course: Course }

export type ParamsType = {
  id: string
  withOrders?: boolean
  withGo1Data?: boolean
  withCancellationRequest?: boolean
  withParticipants?: boolean
  profileId: string
}

export const QUERY = gql`
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetUserCourseById(
    $id: Int!
    $withOrders: Boolean = false
    $withGo1Data: Boolean = false
    $profileId: uuid!
    $withCancellationRequest: Boolean = false
    $withParticipants: Boolean = false
  ) {
    course: course_by_pk(id: $id) {
      id
      name
      type
      deliveryType
      go1Integration @include(if: $withGo1Data)
      cancellationRequest @include(if: $withCancellationRequest) {
        id
      }
      level
      course_code
      reaccreditation
      min_participants
      max_participants
      special_instructions
      parking_instructions
      level
      organization {
        id
        name
        members(where: { isAdmin: { _eq: true } }) {
          isAdmin
          profile_id
        }
      }
      trainers {
        id
        type
        profile {
          id
          givenName
          familyName
          fullName
          avatar
          archived
        }
      }
      participants(where: { profile_id: { _eq: $profileId } }) {
        healthSafetyConsent
        grade
        attended
      }

      courseParticipants: participants @include(if: $withParticipants) {
        healthSafetyConsent
        grade
        attended
      }

      evaluation_answers_aggregate(
        distinct_on: profileId
        where: { profileId: { _eq: $profileId } }
      ) {
        aggregate {
          count
        }
      }
      schedule {
        ...CourseSchedule
        venue {
          ...Venue
        }
      }
      dates: schedule_aggregate {
        aggregate {
          start: min {
            date: start
          }
          end: max {
            date: end
          }
        }
      }
      bookingContact {
        id
        email
        fullName
      }

      organizationKeyContact {
        id
        email
        fullName
      }

      status
      accreditedBy
      bildModules {
        id
        modules
      }
      bildStrategies {
        strategyName
      }
      moduleGroupIds: modules {
        module {
          moduleGroup {
            id
          }
        }
      }
      participantSubmittedEvaluationCount: participants_aggregate(
        where: { completed_evaluation: { _eq: true } }
      ) {
        aggregate {
          count
        }
      }
      certificateCount: participants_aggregate(
        where: { grade: { _in: [PASS, OBSERVE_ONLY, ASSIST_ONLY] } }
      ) {
        aggregate {
          count
        }
      }
      orders @include(if: $withOrders) {
        id
        xeroInvoiceNumber
        source
      }
    }
  }
`
