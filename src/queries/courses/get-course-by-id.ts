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
  ) {
    course: course_by_pk(id: $id) {
      ...Course
      isDraft
      # TODO: Delete this after Arlo migration
      arloReferenceId @include(if: $withArloRefId)
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
      cancellationRequest {
        id
        reason
      }
      trainers {
        id
        type
        status
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

      certificateCount: participants_aggregate(
        where: { grade: { _in: [PASS, OBSERVE_ONLY, ASSIST_ONLY] } }
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
    }
  }
`
