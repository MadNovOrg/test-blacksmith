import { gql } from 'urql'

import { COURSE_FRAGMENT } from '../Hero/Hero'

export const SET_COURSE_AS_DRAFT = gql`
  mutation setCourseAsDraft($id: Int!) {
    update_course_by_pk(
      pk_columns: { id: $id }
      _set: { isDraft: true, status: null }
    ) {
      id
    }
  }
`

export const COURSE_QUERY = gql`
  ${COURSE_FRAGMENT}

  query CourseToBuild(
    $id: Int!
    $withModules: Boolean = false
    $withStrategies: Boolean = false
  ) {
    course: course_by_pk(id: $id) {
      ...CourseHero
      moduleGroupIds: modules @include(if: $withModules) {
        module {
          moduleGroup {
            id
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
