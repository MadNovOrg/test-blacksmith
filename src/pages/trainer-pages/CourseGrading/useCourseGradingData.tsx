import { gql } from 'graphql-request'
import useSWR from 'swr'

import { Grade_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

type ParamsType = {
  id: string
}

type ResponseType = {
  course: {
    id: number
    name: string
    type: CourseType
    level: CourseLevel
    deliveryType: CourseDeliveryType
    participants: Array<{
      id: string
      profile: { id: string; fullName: string; avatar: string }
      attended: boolean
      grade?: Grade_Enum
    }>
    modules: Array<{
      id: string
      covered: boolean
      module: {
        id: string
        name: string
        moduleGroup: { id: string; name: string; mandatory: boolean }
      }
    }>
  }
}

const QUERY = gql`
  query CourseGradingData($id: Int!) {
    course: course_by_pk(id: $id) {
      id
      name
      type
      level
      deliveryType
      participants {
        id
        profile {
          id
          fullName
          avatar
        }
        attended
        grade
      }
      modules {
        id
        covered
        module {
          id
          name
          moduleGroup {
            id
            name
            mandatory
          }
        }
      }
    }
  }
`

export default function useCourseGradingData(courseId: string): {
  data?: ResponseType['course']
  status: LoadingStatus
  error?: Error
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
