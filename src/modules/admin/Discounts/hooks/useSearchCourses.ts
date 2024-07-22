import { gql } from 'graphql-request'
import { useQuery } from 'urql'

import {
  Course_Bool_Exp,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  SearchCoursesQuery,
  SearchCoursesQueryVariables,
} from '@app/generated/graphql'

export type QueryResult = {
  courses: SearchCourse[]
  selectedCourses: SearchCourse[]
}

export type SearchCourse = {
  id: number
  name: string
  level: Course_Level_Enum
  deliveryType: Course_Delivery_Type_Enum
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
      order_by: { schedule_aggregate: { max: { start: asc } } }
    ) {
      ...SearchCourse
    }
  }
`

export default function useSearchCourses(
  where: Course_Bool_Exp,
  selectedIds: number[],
) {
  const [{ data, error, fetching }, mutate] = useQuery<
    SearchCoursesQuery,
    SearchCoursesQueryVariables
  >({
    query: SEARCH_COURSES,
    variables: {
      where: where,
      selectedIds: selectedIds,
    },
  })

  return {
    data,
    error,
    fetching,
    mutate,
  }
}
