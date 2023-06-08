import useSWR from 'swr'
import { KeyedMutator } from 'swr'

import { useAuth } from '@app/context/auth'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/courses/get-course-by-id'
import { CourseType } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCourse(courseId: string): {
  data?: ResponseType['course']
  error?: Error
  status: LoadingStatus
  mutate: KeyedMutator<ResponseType>
} {
  const { acl } = useAuth()

  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType]
  >([
    QUERY,
    {
      id: courseId,
      withOrders: acl.canInviteAttendees(CourseType.OPEN),
    },
  ])

  return {
    data: data?.course,
    error,
    status: getSWRLoadingStatus(data, error),
    mutate,
  }
}
