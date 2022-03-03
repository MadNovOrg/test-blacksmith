import useSWR from 'swr'

import { getSWRLoadingStatus, LoadingStatus } from '@app/util'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/courses/get-course-by-id'

export default function useCourse(courseId: string): {
  data?: ResponseType['course']
  error?: Error
  status: LoadingStatus
} {
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    { id: courseId },
  ])

  return {
    data: data?.course,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
