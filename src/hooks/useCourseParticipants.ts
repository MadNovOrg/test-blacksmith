import useSWR from 'swr'
import { KeyedMutator } from 'swr/dist/types'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participants'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type CourseParticipantCriteria =
  | {
      course_id: { _eq: string }
    }
  | {
      attended?: { _eq: boolean }
    }
  | {
      certificate: { id: { _is_null: boolean } }
    }
  | {
      profile: {
        _or: [
          { fullName: { _ilike: string } },
          { familyName: { _ilike: string } }
        ]
      }
    }
  | {
      certificate: { expiryDate: { _gte: Date } }
    }
  | {
      certificate: { expiryDate: { _lte: Date } }
    }
  | {
      _and: CourseParticipantCriteria[]
    }

export default function useCourseParticipants(
  courseId?: string,
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
  mutate: KeyedMutator<ResponseType>
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

  const queryConditions: CourseParticipantCriteria[] = []
  if (courseId) {
    queryConditions.push({ course_id: { _eq: courseId } })
  }
  if (options?.where) {
    queryConditions.push(options.where)
  }

  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType]
  >([
    QUERY,
    {
      limit: options?.pagination?.limit,
      offset: options?.pagination?.offset,
      where: { _and: queryConditions },
      orderBy,
    },
  ])

  return {
    data: data?.courseParticipants,
    error,
    total: data?.courseParticipantsAggregation.aggregate.count,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
