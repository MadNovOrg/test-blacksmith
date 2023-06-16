import { gql } from 'graphql-request'

export const FINALIZE_COURSE_BUILDER_MUTATION = gql`
  mutation FinalizeCourseBuilder(
    $id: Int!
    $duration: Int!
    $status: course_status_enum
  ) {
    update_course_by_pk(
      pk_columns: { id: $id }
      _set: { modulesDuration: $duration, status: $status, isDraft: false }
    ) {
      id
    }
  }
`
