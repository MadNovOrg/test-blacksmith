import { gql } from 'graphql-request'

export const QUERY = gql`
  mutation RemoveCourseDraft($draftId: uuid!) {
    delete_course_draft_by_pk(id: $draftId) {
      id
    }
  }
`
