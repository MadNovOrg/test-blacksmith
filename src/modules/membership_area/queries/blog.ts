import { gql } from 'graphql-request'

import { PostSummary } from '@app/queries/fragments'

export default gql`
  ${PostSummary}

  query Blog(
    $orderDirection: OrderEnum! = DESC
    $term: String
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    content {
      posts(
        after: $after
        first: $first
        last: $last
        before: $before
        where: {
          orderby: { field: DATE, order: $orderDirection }
          search: $term
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...PostSummary
        }
      }
    }
  }
`
