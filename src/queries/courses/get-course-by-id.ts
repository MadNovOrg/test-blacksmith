import { gql } from 'graphql-request'

import { COURSE, COURSE_SCHEDULE, VENUE } from '../fragments'

import { Course } from '@app/types'

export type ResponseType = { course: Course }

export type ParamsType = { id: string }

export const QUERY = gql`
  ${COURSE}
  ${COURSE_SCHEDULE}
  ${VENUE}
  query GetCourseById($id: uuid!) {
    course: course_by_pk(id: $id) {
      ...Course
      trainer {
        id
        givenName
        familyName
      }
      schedule {
        ...CourseSchedule
        venue {
          ...Venue
        }
      }
    }
  }
`
