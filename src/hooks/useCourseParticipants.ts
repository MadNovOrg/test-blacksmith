import useSWR from 'swr'

import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participants'
import { SortOrder } from '@app/types'

export type CourseParticipantCriteria = {
  attended?: { _eq: boolean }
}

export default function useCourseParticipants(
  courseId: string,
  options?: {
    sortBy?: string
    order?: SortOrder
    pagination?: { limit: number; offset: number }
    where?: CourseParticipantCriteria
  }
): {
  data?: ResponseType['courseParticipants']
  error?: Error
  total?: number
  status: LoadingStatus
} {
  const sortBy = options?.sortBy ?? 'name'
  const order = options?.order ?? 'asc'
  let orderBy: ParamsType['orderBy'] = {
    profile: { fullName: order },
  }
  if (sortBy === 'contact') {
    orderBy = { profile: { email: order } }
  }
  if (sortBy === 'bl-status') {
    orderBy = { go1EnrolmentStatus: order }
  }
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    {
      courseId: courseId,
      limit: options?.pagination?.limit,
      offset: options?.pagination?.offset,
      where: options?.where,
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
