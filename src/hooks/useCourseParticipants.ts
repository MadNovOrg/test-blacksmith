import useSWR from 'swr'

import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participants'

export default function useCourseParticipants(
  courseId: string,
  pagination?: { limit: number; offset: number }
): {
  data?: ResponseType['courseParticipants']
  error?: Error
  total?: number
  status: LoadingStatus
} {
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    {
      courseId: courseId,
      limit: pagination?.limit,
      offset: pagination?.offset,
    },
  ])

  return {
    data: data?.courseParticipants,
    error,
    total: data?.courseParticipantsAggregation.aggregate.count,
    status: getSWRLoadingStatus(data, error),
  }
}
