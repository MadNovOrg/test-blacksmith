import { useQuery } from 'urql'

import {
  CourseModulesQuery,
  CourseModulesQueryVariables,
} from '@app/generated/graphql'
import { GET_COURSE_MODULES } from '@app/queries/courses/get-course-modules'

export default function useCourseModules(courseId: string): {
  fetching: boolean
  data?: CourseModulesQuery['courseModules']
  error?: Error
} {
  const [{ data, error, fetching }] = useQuery<
    CourseModulesQuery,
    CourseModulesQueryVariables
  >({ query: GET_COURSE_MODULES, variables: { id: Number(courseId) ?? 0 } })

  return {
    fetching,
    data: data?.courseModules,
    error,
  }
}
