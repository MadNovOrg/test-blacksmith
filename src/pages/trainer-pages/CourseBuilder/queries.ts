import { gql } from 'urql'

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

export const COURSE_WITH_MODULE_GROUPS = gql`
  query CourseWithModuleGroups($id: Int!) {
    course: course_by_pk(id: $id) {
      id
      name
      isDraft
      updatedAt
      course_code
      deliveryType
      level
      type
      go1Integration
      reaccreditation
      moduleGroupIds: modules {
        module {
          moduleGroup {
            id
          }
        }
      }
      start
      end
      organization {
        name
      }
      schedule {
        venue {
          name
          city
        }
      }
    }
  }
`
