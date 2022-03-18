import useSWR from 'swr'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/courses/get-course-modules'
import { CourseModule } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useCourseModules(courseId: string): {
  status: LoadingStatus
  data?: CourseModule[]
  error?: Error
} {
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    { id: courseId },
  ])

  return {
    status: getSWRLoadingStatus(data, error),
    data: data?.courseModules,
    error,
  }
}
