import { gql } from 'graphql-request'

import { Course } from '@app/types'

import { COURSE_SCHEDULE, VENUE, ORGANIZATION } from '../fragments'

// TODO: can't share types as user queries select different columns
export type ResponseType = { course: Course }

export type ParamsType = { id: string }

export const QUERY = gql`
  ${COURSE_SCHEDULE}
  ${VENUE}
  ${ORGANIZATION}
  query GetUserCourseById($id: Int!) {
    course: course_by_pk(id: $id) {
      id
      name
      type
      deliveryType
      level
      course_code
      reaccreditation
      min_participants
      max_participants
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
    }
  }
`
