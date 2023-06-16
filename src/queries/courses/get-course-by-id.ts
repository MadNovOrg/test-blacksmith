import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE, COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

export type ResponseType = { course: Course }

export type ParamsType = { id: string; withOrders?: boolean }

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetCourseById($id: Int!, $withOrders: Boolean = false) {
    course: course_by_pk(id: $id) {
      ...Course
      isDraft
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
