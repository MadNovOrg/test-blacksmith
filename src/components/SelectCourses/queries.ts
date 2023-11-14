import { gql } from 'graphql-request'

import { CourseDeliveryType, CourseLevel } from '@app/types'

export type QueryResult = {
  courses: SearchCourse[]
  selectedCourses: SearchCourse[]
}

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
  query SearchCourses($where: course_bool_exp!, $selectedIds: [Int!]!) {
    selectedCourses: course(
      where: { _and: [$where, { id: { _in: $selectedIds } }] }
    ) {
      ...SearchCourse
    }
    courses: course(
      where: { _and: [$where, { id: { _nin: $selectedIds } }] }
      limit: 200
      order_by: { start: asc }
    ) {
      ...SearchCourse
    }
  }
`
