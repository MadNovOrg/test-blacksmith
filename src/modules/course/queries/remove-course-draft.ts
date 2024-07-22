import { gql } from 'graphql-request'

export const REMOVE_COURSE_DRAFT = gql`
  mutation RemoveCourseDraft($draftId: uuid!) {
    delete_course_draft_by_pk(id: $draftId) {
      id
    }
  }
`
