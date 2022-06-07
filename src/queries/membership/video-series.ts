import { gql } from 'graphql-request'

import { VideoItemSummary } from '@app/queries/fragments'

export default gql`
  ${VideoItemSummary}

  query VideoSeries(
    $term: String
    $orderDirection: OrderEnum = DESC
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      videoSeriesItems(
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
          ...VideoItemSummary
        }
      }
    }
  }
`
