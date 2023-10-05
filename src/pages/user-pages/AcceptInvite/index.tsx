import { Alert, CircularProgress, Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetCourseParticipantByInviteQuery,
  GetCourseParticipantByInviteQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_PARTICIPANT } from '@app/queries/course-participant/get-course-participant-by-invitation'
import {
  MUTATION as ACCEPT_INVITE_MUTATION,
  ParamsType as AcceptInviteParamsType,
  ResponseType as AcceptInviteResponseType,
} from '@app/queries/invites/accept-invite'
import { InviteStatus, RoleName } from '@app/types'

export const AcceptInvite = () => {
  const auth = useAuth()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const params = useParams()
  const [searchParams] = useSearchParams()

  const courseId = searchParams.get('courseId') || ''
  const inviteId = params.id as string

  useEffect(() => {
    if (auth.activeRole !== RoleName.USER) auth.changeRole(RoleName.USER)
  }, [auth])

  const [{ data: courseParticipants }] = useQuery<
    GetCourseParticipantByInviteQuery,
    GetCourseParticipantByInviteQueryVariables
  >({
    query: GET_COURSE_PARTICIPANT,
    variables: { courseId: +courseId, inviteId },
  })

  const [, acceptInvite] = useMutation<
    AcceptInviteResponseType,
    AcceptInviteParamsType
  >(ACCEPT_INVITE_MUTATION)

  const acceptInviteCallback = useCallback(async () => {
    if (
      courseParticipants?.course_participant &&
      auth.activeRole === RoleName.USER
    ) {
      if (courseParticipants.course_participant.length > 0) {
        setSuccess(true)
        return
      }
      const { data: resp } = await acceptInvite({ inviteId, courseId })
      if (
        resp?.acceptInvite?.status !== InviteStatus.ACCEPTED &&
        !resp?.addParticipant?.id
      ) {
        setError(true)
      }

      setSuccess(true)
    }
  }, [
    acceptInvite,
    auth,
    courseId,
    courseParticipants?.course_participant,
    inviteId,
  ])

  useEffect(() => {
    acceptInviteCallback()
  }, [acceptInviteCallback])

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Alert
          severity="error"
          variant="outlined"
          data-testid="accept-invite-error-alert"
        >
          There was an error accepting the invite. Please try again later.
        </Alert>
      </Container>
    )
  }

  if (success) {
    return (
      <Navigate
        to={`/courses/${courseId}/details?success=invite_accepted`}
        replace
      />
    )
  }

  return <CircularProgress size={50} />
}
