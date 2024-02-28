import { gql } from 'graphql-request'

import { Maybe } from '@app/generated/graphql'
import { Course } from '@app/types'

import { COURSE, COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

export type ResponseType = { course: Maybe<Course> }

// TODO: Scrap this and use GetCourseByIdQuery and GetCourseByIdQueryVariables
export type ParamsType = {
  id: string
  withOrders?: boolean
  withArloRefId: boolean
  withParticipants?: boolean
  withInternationalFinance?: boolean
}

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetCourseById(
    $id: Int!
    $withOrders: Boolean = false
    $withModules: Boolean = false
    $withArloRefId: Boolean = false
    $withParticipants: Boolean = false
    $withInternationalFinance: Boolean = false
  ) {
    course: course_by_pk(id: $id) {
      ...Course
      isDraft
      # TODO: Delete this after Arlo migration
      arloReferenceId @include(if: $withArloRefId)
      displayOnWebsite
      curriculum
      bildModules {
        id
        modules
      }
      bildStrategies {
        strategyName
      }
      accreditedBy
      conversion
      freeSpaces
      accountCode
      level
      special_instructions
      parking_instructions
      accreditedBy
      price
      exceptionsPending
      renewalCycle
      cancellationRequest {
        id
        reason
      }
      priceCurrency @include(if: $withInternationalFinance)
      includeVAT @include(if: $withInternationalFinance)
      trainers {
        id
        type
        status
        course_id
        profile {
          id
          givenName
          familyName
          fullName
          avatar
          archived
          certificates {
            courseLevel
            expiryDate
          }
          trainer_role_types {
            trainer_role_type {
              id
              name
            }
          }
        }
      }
      schedule {
        ...CourseSchedule
        virtualAccountId
        timeZone
        venue {
          ...Venue
        }
      }
      organization {
        ...Organization
      }
      bookingContact {
        id
        fullName
        avatar
        archived
        email
        givenName
        familyName
      }
      bookingContactInviteData
      organizationKeyContact {
        id
        fullName
        avatar
        archived
        email
        givenName
        familyName
      }
      organizationKeyContactInviteData
      orders @include(if: $withOrders) {
        id
        xeroInvoiceNumber
        salesRepresentative {
          id
          fullName
          avatar
          archived
        }
        source
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
      moduleGroupIds: modules {
        module {
          moduleGroup {
            id
          }
        }
      }

      modules(
        order_by: { module: { moduleGroup: { mandatory: desc, name: asc } } }
      ) @include(if: $withModules) {
        id
        covered
        module {
          id
          name
          moduleGroup {
            id
            name
            mandatory
          }
        }
      }

      courseParticipants: participants @include(if: $withParticipants) {
        healthSafetyConsent
        grade
        attended
      }

      certificateCount: participants_aggregate(
        where: { grade: { _in: [PASS, OBSERVE_ONLY, ASSIST_ONLY] } }
      ) {
        aggregate {
          count
        }
      }
      participantSubmittedEvaluationCount: participants_aggregate(
        where: { completed_evaluation: { _eq: true } }
      ) {
        aggregate {
          count
        }
      }
      attendeesCount: participants_aggregate {
        aggregate {
          count
        }
      }
      courseExceptions {
        exception
      }
    }
  }
`
