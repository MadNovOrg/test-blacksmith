import { gql } from 'graphql-request'

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
