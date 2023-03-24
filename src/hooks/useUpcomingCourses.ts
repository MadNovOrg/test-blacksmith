import useSWR from 'swr'

import {
  Course_Bool_Exp,
  GetUpcomingCoursesQuery,
  GetUpcomingCoursesQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/courses/get-upcoming-courses'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useUpcomingCourses(
  profileId?: string,
  courseFilter?: Course_Bool_Exp,
  limit?: number
) {
  const { data, error, mutate } = useSWR<
    GetUpcomingCoursesQuery,
    Error,
    [string, GetUpcomingCoursesQueryVariables] | null
  >(profileId ? [QUERY, { courseFilter, limit }] : null)

  const status = getSWRLoadingStatus(data, error)

  return {
    courses: data?.courses,
    error,
    status,
    loading: status === LoadingStatus.FETCHING,
    mutate,
  }
}
