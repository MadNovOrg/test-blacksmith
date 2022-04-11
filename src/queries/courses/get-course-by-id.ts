import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE, COURSE_SCHEDULE, VENUE, ORGANIZATION } from '../fragments'

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
      level
      trainers {
        id
        type
        profile {
          id
          givenName
          familyName
          fullName
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
    }
  }
`
