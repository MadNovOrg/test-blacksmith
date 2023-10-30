import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetCourseDraft($draftId: uuid!) {
    course_draft_by_pk(id: $draftId) {
      id
      name
      data
      updatedAt
    }
  }
`
