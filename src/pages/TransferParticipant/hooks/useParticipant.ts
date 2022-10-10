import { useQuery } from 'urql'

import {
  ParticipantTransferQuery,
  ParticipantTransferQueryVariables,
} from '@app/generated/graphql'

import { PARTICIPANT_TRANSFER } from '../queries'

export function useParticipant(id: string) {
  const [{ data, fetching, error }] = useQuery<
    ParticipantTransferQuery,
    ParticipantTransferQueryVariables
  >({ query: PARTICIPANT_TRANSFER, variables: { id } })

  return {
    participant: data?.participant,
    fetching,
    error,
  }
}
