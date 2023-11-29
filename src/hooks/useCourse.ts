import { useMemo } from 'react'
import useSWR from 'swr'
import { KeyedMutator } from 'swr'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/courses/get-course-by-id'
import { InviteStatus, RoleName } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCourse(courseId: string): {
  data?: ResponseType['course']
  error?: Error
  status: LoadingStatus
  mutate: KeyedMutator<ResponseType>
} {
  const { acl, activeRole, profile } = useAuth()

  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType]
  >([
    QUERY,
    {
      id: courseId,
      withOrders:
        acl.canInviteAttendees(Course_Type_Enum.Open) ||
        acl.canViewCourseOrder(),
      withArloRefId: acl.isInternalUser(),
      withParticipants: acl.isOrgAdmin(),
    },
  ])

  const course = useMemo(() => {
    if (activeRole === RoleName.TRAINER) {
      const hasAcceptedInvite = data?.course?.trainers?.find(
        t => t.profile.id === profile?.id && t.status === InviteStatus.ACCEPTED
      )

      return hasAcceptedInvite ? data?.course : undefined
    }

    return data?.course
  }, [activeRole, data?.course, profile])

  return {
    data: course,
    error,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
