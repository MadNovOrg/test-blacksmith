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
