import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetCourseParticipantForTransferQuery,
  GetCourseParticipantForTransferQueryVariables,
} from '@app/generated/graphql'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { GET_PARTICIPANT_FOR_TRANSFER } from '@app/modules/transfer_participant/queries/get-course-participant-for-transfer-by-profile-id'

import {
  TransferModeEnum,
  TransferParticipantProvider,
} from '../../components/TransferParticipantProvider'
import { TransferParticipant } from '../TransferParticipant/TransferParticipant'

export const UserTransferParticipant: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
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
    GetCourseParticipantForTransferQuery,
    GetCourseParticipantForTransferQueryVariables
  >({
    query: GET_PARTICIPANT_FOR_TRANSFER,
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
