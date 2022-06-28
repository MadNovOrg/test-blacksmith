import { gql } from 'graphql-request'

import { CourseDeliveryType, CourseLevel } from '@app/types'

export type QueryResult = { courses: SearchCourse[] }

export type SearchCourse = {
  id: number
  name: string
  level: CourseLevel
  deliveryType: CourseDeliveryType
  schedule: {
    start: string
    venue: { city: string }
  }[]
}

const COURSE = gql`
  fragment SearchCourse on course {
    id
    name
    level
    deliveryType
    schedule {
      start
      venue {
        city
      }
    }
  }
`

export const SEARCH_COURSES = gql`
  ${COURSE}
  query SearchCourses($where: course_bool_exp) {
    courses: course(
      where: $where
      limit: 200
      order_by: { schedule_aggregate: { min: { start: asc } } }
    ) {
      ...SearchCourse
    }
  }
`

export const GET_SELECTED = gql`
  ${COURSE}
  query GetSelectedCourses($ids: [Int!]!) {
    courses: course(where: { id: { _in: $ids } }) {
      ...SearchCourse
    }
  }
`
