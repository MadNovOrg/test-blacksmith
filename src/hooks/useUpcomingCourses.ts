import { useMemo } from 'react'
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

  const coursesForBooking = useMemo(() => {
    return data?.courses
      ? data.courses.filter(
          course =>
            (course.participantsCount?.aggregate?.count ?? 0) <
            course.max_participants
        )
      : []
  }, [data])

  return {
    courses: data?.courses,
    coursesForBooking,
    error,
    status,
    loading: status === LoadingStatus.FETCHING,
    mutate,
  }
}
