import useSWR from 'swr'
import { useEffect, useState } from 'react'

import { useAuth } from '@app/context/auth'

import {
  MUTATION as ACCEPT_INVITE_MUTATION,
  ParamsType as AcceptinviteParamsType,
  ResponseType as AcceptInviteResponseType,
} from '@app/queries/invites/accept-invite'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  MUTATION as INSERT_PARTICIPANT_MUTATION,
  ParamsType as InsertParticipantParamsType,
  ResponseType as InsertParticipantResponseType,
} from '@app/queries/participants/insert-course-participant'

export default function useAcceptInvite(courseId: string): {
  status: LoadingStatus
} {
  const { profile } = useAuth()
  const [courseParticipantInput, setCourseParticipantInput] =
    useState<InsertParticipantParamsType | null>(null)

  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.FETCHING)

  const { data: acceptInviteData, error: acceptInviteError } = useSWR<
    AcceptInviteResponseType,
    Error,
    [string, AcceptinviteParamsType] | null
  >(
    profile && courseId
      ? [ACCEPT_INVITE_MUTATION, { courseId, email: profile.email }]
      : null
  )

  const { data: insertParticipantData, error: insertParticipantError } = useSWR<
    InsertParticipantResponseType,
    Error,
    [string, InsertParticipantParamsType] | null
  >(
    courseParticipantInput
      ? [INSERT_PARTICIPANT_MUTATION, courseParticipantInput]
      : null
  )

  useEffect(() => {
    if (profile && acceptInviteData?.acceptInvite.returning.length) {
      setCourseParticipantInput({
        courseId: courseId,
        inviteId: acceptInviteData.acceptInvite.returning[0].id,
      })
    }
  }, [acceptInviteData, profile, courseId])

  useEffect(() => {
    const acceptInviteStatus = getSWRLoadingStatus(
      acceptInviteData,
      acceptInviteError
    )

    const insertParticipantStatus = getSWRLoadingStatus(
      insertParticipantData,
      insertParticipantError
    )

    const hasAcceptInviteError =
      acceptInviteStatus === LoadingStatus.ERROR ||
      (acceptInviteStatus === LoadingStatus.SUCCESS &&
        !acceptInviteData?.acceptInvite.returning.length)

    const hasInsertError =
      (insertParticipantStatus === LoadingStatus.SUCCESS &&
        !insertParticipantData?.insertCourseParticipant) ||
      insertParticipantStatus === LoadingStatus.ERROR

    const hasError = hasAcceptInviteError || hasInsertError

    if (hasError) {
      setStatus(LoadingStatus.ERROR)
    } else if (insertParticipantData?.insertCourseParticipant.id) {
      setStatus(LoadingStatus.SUCCESS)
    }
  }, [
    acceptInviteData,
    acceptInviteError,
    insertParticipantData,
    insertParticipantError,
  ])

  return {
    status,
  }
}
