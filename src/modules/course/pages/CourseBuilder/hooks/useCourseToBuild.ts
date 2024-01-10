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

export function useCourseToBuild(courseId: number) {
  return useQuery<CourseToBuildQuery, CourseToBuildQueryVariables>({
    query: COURSE_TO_BUILD_QUERY,
    variables: courseId ? { id: courseId, withModules: true } : undefined,
    requestPolicy: 'cache-and-network',
  })
}
