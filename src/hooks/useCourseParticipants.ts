import useSWR from 'swr'
import { KeyedMutator } from 'swr'

import { Course_Type_Enum } from '@app/generated/graphql'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/participants/get-course-participants'
import { CertificateStatus, SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type CourseParticipantCriteria =
  | {
      course_id: { _eq: number }
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
      certificate: { certificationDate: { _gte: Date } }
    }
  | {
      certificate: { certificationDate: { _lte: Date } }
    }
  | {
      certificate: { status: { _in: CertificateStatus[] } }
    }
  | {
      course: { type: { _in: Course_Type_Enum[] } }
    }
  | {
      course: {
        _or: [{ course_code: { _ilike: string } }]
      }
    }
  | {
      _and: CourseParticipantCriteria[]
    }
  | {
      _or: CourseParticipantCriteria[]
    }

export default function useCourseParticipants(
  courseId?: number,
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
