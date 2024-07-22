import { gql } from 'graphql-request'

export const GET_COURSE_DRAFTS = gql`
  query GetCourseDrafts(
    $orderBy: [course_draft_order_by!] = { createdAt: desc }
    $offset: Int
    $limit: Int
  ) {
    course_draft(order_by: $orderBy, offset: $offset, limit: $limit) {
      id
      name
      data
      profile {
        id
        givenName
        familyName
      }
      createdAt
      updatedAt
    }
    course_draft_aggregate {
      aggregate {
        count
      }
    }
  }
`
