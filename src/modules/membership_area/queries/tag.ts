import { gql } from 'graphql-request'

import { PostSummary } from '@app/queries/fragments'

export default gql`
  ${PostSummary}

  query Tag(
    $id: ID!
    $orderDirection: OrderEnum = DESC
    $term: String
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      tag(id: $id) {
        id
        name
        posts(
          where: {
            orderby: { field: DATE, order: $orderDirection }
            search: $term
          }
          first: $first
          last: $last
          before: $before
          after: $after
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
          nodes {
            ...PostSummary
          }
        }
      }
    }
  }
`
