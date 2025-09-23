import { useQuery } from 'urql'

import {
  TransferParticipantDetailsQuery,
  TransferParticipantDetailsQueryVariables,
} from '@app/generated/graphql'

import { TRANSFER_PARTICIPANT_DETAILS } from '../queries/queries'

export function useTransferDetails(courseId: number, participantId: string) {
  const [{ data, fetching, error }] = useQuery<
    TransferParticipantDetailsQuery,
    TransferParticipantDetailsQueryVariables
  >({
    query: TRANSFER_PARTICIPANT_DETAILS,
    variables: {
      courseId: courseId,
      participantId,
    },
    requestPolicy: 'cache-and-network',
  })

  return {
    course: data?.course,
    participant: data?.participant,
    fetching,
    error,
  }
}
