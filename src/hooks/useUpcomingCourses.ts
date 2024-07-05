import { useQuery } from 'urql'

import {
  Course_Bool_Exp,
  GetUpcomingCoursesQuery,
  GetUpcomingCoursesQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/courses/get-upcoming-courses'

export default function useUpcomingCourses(
  profileId?: string,
  courseFilter?: Course_Bool_Exp,
  limit?: number,
) {
  const [{ data, error, fetching, stale }, mutate] = useQuery<
    GetUpcomingCoursesQuery,
    GetUpcomingCoursesQueryVariables
  >({
    query: QUERY,
    pause: !profileId,
    variables: {
      courseFilter,
      limit,
    },
  })

  return {
    courses: data?.courses,
    error,
    fetching,
    stale,
    mutate,
  }
}
