import { gql } from 'graphql-request'

export const GET_COURSE_DRAFT = gql`
  query GetCourseDraft($draftId: uuid!) {
    course_draft_by_pk(id: $draftId) {
      id
      name
      data
      updatedAt
    }
  }
`
