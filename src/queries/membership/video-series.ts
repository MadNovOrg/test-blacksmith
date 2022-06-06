import { gql } from 'graphql-request'

export default gql`
  fragment VideoSeriesSummary on VideoSeriesItem {
    id
    title
    excerpt
    featuredImage {
      node {
        mediaItemUrl
      }
    }
    youtube {
      url
    }
    date
  }

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
          ...VideoSeriesSummary
        }
      }
    }
  }
`
