import useSWR from 'swr'

import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participants'
import { SortOrder } from '@app/types'

export default function useCourseParticipants(
  courseId: string,
  sortBy = 'name',
  order: SortOrder = 'asc',
  pagination?: { limit: number; offset: number }
): {
  data?: ResponseType['courseParticipants']
  error?: Error
  total?: number
  status: LoadingStatus
} {
  let orderBy: ParamsType['orderBy'] = {
    profile: { givenName: order, familyName: order },
  }
  if (sortBy === 'contact') {
    orderBy = { profile: { email: order } }
  }
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    {
      courseId: courseId,
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy,
    },
  ])

  return {
    data: data?.courseParticipants,
    error,
    total: data?.courseParticipantsAggregation.aggregate.count,
    status: getSWRLoadingStatus(data, error),
  }
}
