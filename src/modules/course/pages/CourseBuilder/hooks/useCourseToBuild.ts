import { gql, useQuery } from 'urql'

import {
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
} from '@app/generated/graphql'

import { COURSE_FRAGMENT } from '../components/Hero/Hero'

export const COURSE_TO_BUILD_QUERY = gql`
  ${COURSE_FRAGMENT}

  query CourseToBuild(
    $id: Int!
    $withModules: Boolean = false
    $withStrategies: Boolean = false
  ) {
    course: course_by_pk(id: $id) {
      ...CourseHero
      curriculum
      conversion
      moduleGroupIds: modules @include(if: $withModules) {
        module {
          moduleGroup {
            id
          }
          submodules {
            id
            name
          }
        }
      }

      bildModules @include(if: $withStrategies) {
        id
        modules
      }
      bildStrategies @include(if: $withStrategies) {
        strategyName
      }
    }
  }
`

export function useCourseToBuild({
  courseId,
  pause = false,
  withModules = true,
  withStrategies,
}: {
  courseId: number
  pause?: boolean
  withModules?: boolean
  withStrategies?: boolean
}) {
  return useQuery<CourseToBuildQuery, CourseToBuildQueryVariables>({
    query: COURSE_TO_BUILD_QUERY,
    variables: courseId
      ? { id: courseId, withModules, withStrategies }
      : undefined,
    requestPolicy: 'cache-and-network',
    pause,
  })
}
