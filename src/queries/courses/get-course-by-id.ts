import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE, COURSE_SCHEDULE, ORGANIZATION, VENUE } from '../fragments'

export type ResponseType = { course: Course }

export type ParamsType = { id: string }

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetCourseById($id: Int!) {
    course: course_by_pk(id: $id) {
      ...Course
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
      contactProfile {
        id
        fullName
        avatar
        archived
      }
      salesRepresentative {
        id
        fullName
        avatar
        archived
      }
      source
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
