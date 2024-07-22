import { gql } from 'graphql-request'

import { WebinarSummary } from '@app/queries/fragments'

export default gql`
  ${WebinarSummary}

  query Webinars(
    $term: String
    $orderDirection: OrderEnum = DESC
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      webinars(
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
          endCursor
          startCursor
        }
        nodes {
          ...WebinarSummary
        }
      }
    }
  }
`
