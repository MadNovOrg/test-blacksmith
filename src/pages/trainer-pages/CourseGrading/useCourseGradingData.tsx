import { gql } from 'graphql-request'
import { useQuery } from 'urql'

import {
  CourseGradingDataQuery,
  CourseGradingDataQueryVariables,
} from '@app/generated/graphql'
import { getSWRLoadingStatus } from '@app/util'

const QUERY = gql`
  query CourseGradingData($id: Int!) {
    course: course_by_pk(id: $id) {
      id
      name
      type
      level
      deliveryType
      accreditedBy
      participants(
        where: { attended: { _eq: true }, grade: { _is_null: true } }
      ) {
        id
        profile {
          id
          fullName
          avatar
        }
        attended
        grade
      }
      modules(order_by: { module: { moduleGroup: { mandatory: desc } } }) {
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
      bildModules {
        id
        modules
      }
      trainers {
        profile_id
        type
      }
    }
  }
`

export default function useCourseGradingData(courseId: number) {
  const [{ data, error }] = useQuery<
    CourseGradingDataQuery,
    CourseGradingDataQueryVariables
  >({
    query: QUERY,
    variables: {
      id: courseId,
    },
    requestPolicy: 'cache-and-network',
  })

  return {
    data: data?.course,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
