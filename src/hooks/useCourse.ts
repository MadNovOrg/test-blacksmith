import useSWR from 'swr'
import { isPast } from 'date-fns'

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
  courseBegan?: boolean
  courseEnded?: boolean
} {
  const { data, error } = useSWR<ResponseType, Error, [string, ParamsType]>([
    QUERY,
    { id: courseId },
  ])

  return {
    data: data?.course,
    error,
    status: getSWRLoadingStatus(data, error),
    courseBegan: data ? isPast(new Date(data.course.schedule[0].start)) : false,
    courseEnded: data ? isPast(new Date(data.course.schedule[0].end)) : false,
  }
}
