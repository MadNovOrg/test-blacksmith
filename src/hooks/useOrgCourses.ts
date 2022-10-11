import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Course_Bool_Exp,
  GetOrgCoursesQuery,
  GetOrgCoursesQueryVariables,
  Organization_Bool_Exp,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/courses/get-org-courses'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export const ALL_ORGS = 'all'

export default function useOrgCourses(
  orgId: string,
  profileId?: string,
  showAll?: boolean,
  courseFilter?: Course_Bool_Exp
) {
  let conditions: Organization_Bool_Exp
  if (orgId !== ALL_ORGS) {
    conditions = { id: { _eq: orgId } }
  } else {
    conditions = showAll
      ? {}
      : {
          members: {
            _and: [
              {
                profile_id: {
                  _eq: profileId,
                },
              },
              { isAdmin: { _eq: true } },
            ],
          },
        }
  }

  const { data, error, mutate } = useSWR<
    GetOrgCoursesQuery,
    Error,
    [string, GetOrgCoursesQueryVariables] | null
  >(
    profileId
      ? [QUERY, { where: conditions, courseFilter: courseFilter }]
      : null
  )

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
