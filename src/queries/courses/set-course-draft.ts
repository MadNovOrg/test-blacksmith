import { gql } from 'graphql-request'

export const QUERY = gql`
  mutation SetCourseDraft($object: course_draft_insert_input!) {
    insert_course_draft_one(
      object: $object
      on_conflict: {
        constraint: course_draft_pkey
        update_columns: [data, name]
      }
    ) {
      id
    }
  }
`
