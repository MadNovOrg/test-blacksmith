import { useMemo } from 'react'
import { type OperationContext, useQuery } from 'urql'

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
  data?: {
    course: ResponseType['course']
    isTrainer?: boolean
    trainerAcceptedInvite?: boolean
  }
  error?: Error
  status: LoadingStatus
  mutate: (opts?: Partial<OperationContext> | undefined) => void
} {
  const { acl, activeRole, profile } = useAuth()

  // TODO: replace with             useQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>
  const [{ data, error }, mutate] = useQuery<ResponseType, ParamsType>({
    query: QUERY,
    variables: {
      id: courseId,
      withOrders:
        acl.canInviteAttendees(Course_Type_Enum.Open) ||
        acl.canViewCourseOrder(),
      withArloRefId: acl.isInternalUser(),
      withParticipants: acl.isOrgAdmin(),
      withInternationalFinance:
        acl.isAdmin() || acl.isTTOps() || acl.isSalesAdmin(),
    },
  })

  const course = useMemo(() => {
    const courseData = {
      course: null,
      isTrainer: false,
      trainerAcceptedInvite: false,
    }

    if (activeRole === RoleName.TRAINER) {
      const hasAcceptedInvite = data?.course?.trainers?.find(
        t => t.profile.id === profile?.id && t.status === InviteStatus.ACCEPTED
      )

      Object.assign(courseData, {
        isTrainer: true,
        trainerAcceptedInvite: hasAcceptedInvite,
        course: data?.course as ResponseType['course'],
      })

      return courseData
    }

    Object.assign(courseData, {
      course: data?.course as ResponseType['course'],
    })

    return courseData
  }, [activeRole, data?.course, profile])

  return {
    data: course,
    error,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
