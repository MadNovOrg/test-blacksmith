import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetCourseParticipantIdQuery,
  GetCourseParticipantIdQueryVariables,
} from '@app/generated/graphql'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'

import { NotFound } from '../common/NotFound'

import {
  TransferModeEnum,
  TransferParticipantProvider,
} from './components/TransferParticipantProvider'
import { TransferParticipant } from './TransferParticipant'

export const UserTransferParticipant: React.FC = () => {
  const { profile } = useAuth()

  // useQuery was updating for some reason
  // after successfully transferring the participant
  // we are fetching participant only at the beginning
  const participantFetched = useRef(false)

  const { id, participantId } = useParams<{
    id: string
    participantId: string
  }>()

  const [{ data: participantData, fetching: participantFetching }] = useQuery<
    GetCourseParticipantIdQuery,
    GetCourseParticipantIdQueryVariables
  >({
    query: GetParticipant,
    variables: { profileId: profile?.id, courseId: Number(id) },
    pause: Boolean(participantId) || participantFetched.current,
  })

  useEffect(() => {
    if (participantData?.course_participant) {
      participantFetched.current = true
    }
  }, [participantData])

  if (
    !participantId &&
    !participantData?.course_participant[0] &&
    !participantFetching
  ) {
    return <NotFound />
  }

  return !participantFetching ? (
    <TransferParticipantProvider
      courseId={Number(id)}
      participantId={participantId ?? participantData?.course_participant[0].id}
      mode={
        participantId
          ? TransferModeEnum.ORG_ADMIN_TRANSFERS
          : TransferModeEnum.ATTENDEE_TRANSFERS
      }
    >
      <TransferParticipant />
    </TransferParticipantProvider>
  ) : null
}
