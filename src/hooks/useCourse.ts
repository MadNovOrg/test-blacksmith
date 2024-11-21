import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useMemo } from 'react'
import { type OperationContext, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Type_Enum,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
} from '@app/generated/graphql'
import { QUERY, ResponseType } from '@app/queries/courses/get-course-by-id'
import { RoleName } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCourse(
  courseId: string,
  options: {
    includeOrgLicenses?: boolean
    includePendingInvitesCount?: boolean
  } = {},
): {
  data?: {
    course: ResponseType['course']
    isTrainer?: boolean
    trainerAcceptedInvite?: boolean
  }
  mutate: (opts?: Partial<OperationContext> | undefined) => void
  status: LoadingStatus
  error?: Error
} {
  const { acl, activeRole, profile } = useAuth()

  const hideMCM = useFeatureFlagEnabled('hide-mcm')

  const [{ data, error }, mutate] = useQuery<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  >({
    query: QUERY,
    variables: {
      id: Number(courseId),
      withArloRefId: acl.isInternalUser(),
      withFreeCourseCourseMaterials: acl.isUK() || !hideMCM,
      withInternationalFinance:
        acl.isAdmin() || acl.isTTOps() || acl.isSalesAdmin(),
      withOrders:
        acl.canInviteAttendees(Course_Type_Enum.Open) ||
        acl.canViewCourseOrder(),
      withOrgLicenses: options.includeOrgLicenses,
      withParticipants:
        acl.isInternalUser() || acl.isOrgAdmin() || acl.isTrainer(),
      withParticipantsPendingInvitesCount: options.includePendingInvitesCount,
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
        t =>
          t.profile.id === profile?.id &&
          t.status === Course_Invite_Status_Enum.Accepted,
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
