import { gql } from 'graphql-request'

import { COURSE, COURSE_SCHEDULE, VENUE, ORGANIZATION } from '../fragments'

import { Course } from '@app/types'

export type ResponseType = { course: Course }

export type ParamsType = { id: string }

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetCourseById($id: uuid!) {
    course: course_by_pk(id: $id) {
      ...Course
      level
      trainer {
        id
        givenName
        familyName
        fullName
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
    }
  }
`
