import useSWR from 'swr'

import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participant-by-id'

export default function useCourseParticipant(participantId: string): {
  data?: ResponseType['participant']
  error?: Error
  status: LoadingStatus
} {
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    { id: participantId },
  ])

  return {
    data: data?.participant,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
