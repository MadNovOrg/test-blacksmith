import { gql } from 'graphql-request'

import { EbookSummary } from '../fragments'

export default gql`
  ${EbookSummary}
  query Ebooks(
    $term: String
    $orderDirection: OrderEnum = DESC
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      ebooks(
        where: {
          search: $term
          orderby: { field: DATE, order: $orderDirection }
        }
        first: $first
        after: $after
        last: $last
        before: $before
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...EbookSummary
        }
      }
    }
  }
`
