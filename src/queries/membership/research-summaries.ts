import { gql } from 'graphql-request'

import { ResearchSummaryDetails } from '../fragments'

export default gql`
  ${ResearchSummaryDetails}

  query ResearchSummaries(
    $term: String
    $orderDirection: OrderEnum = DESC
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      researchSummaries(
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
          ...ResearchSummaryDetails
        }
      }
    }
  }
`
