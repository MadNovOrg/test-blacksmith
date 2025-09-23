import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  UserCoursesQuery,
  UserCoursesQueryVariables,
} from '@app/generated/graphql'
import { GET_UNEVALUATED_USER_COURSES } from '@app/modules/course_details/course_evaluation_tab/queries/get-unevaluated-user-courses'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export function useUnevaluatedUserCourses(): {
  courses?: UserCoursesQuery['courses']
  error?: Error
  status: LoadingStatus
} {
  const { profile } = useAuth()

  const [{ data, error }] = useQuery<
    UserCoursesQuery,
    UserCoursesQueryVariables
  >({
    query: GET_UNEVALUATED_USER_COURSES,
    variables: {
      where: { participants: { attended: { _eq: true } } },
      profileId: profile?.id,
    },
  })

  return {
    courses: data?.courses.filter(
      course => course.evaluation_answers_aggregate.aggregate?.count === 0,
    ),
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
