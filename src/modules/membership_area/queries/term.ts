import { gql } from 'graphql-request'

import {
  EbookSummary,
  PostSummary,
  ResearchSummaryDetails,
  VideoItemSummary,
  WebinarSummary,
} from '@app/queries/fragments'

export default gql`
  ${PostSummary}
  ${EbookSummary}
  ${WebinarSummary}
  ${ResearchSummaryDetails}
  ${VideoItemSummary}

  fragment PaginationInfo on WPPageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }

  query Term(
    $id: ID!
    $orderDirection: OrderEnum = DESC
    $term: String
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    content {
      termNode(id: $id) {
        id
        name
        __typename

        ... on Category {
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
              ...PaginationInfo
            }
            nodes {
              ...PostSummary
            }
          }
        }

        ... on Tag {
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
              ...PaginationInfo
            }
            nodes {
              ...PostSummary
            }
          }
        }

        ... on EbooksCategory {
          ebooks(
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
              ...PaginationInfo
            }
            nodes {
              ...EbookSummary
            }
          }
        }

        ... on WebinarsCategory {
          webinars(
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
              ...PaginationInfo
            }
            nodes {
              ...WebinarSummary
            }
          }
        }

        ... on ResearchSummariesCategory {
          researchSummaries(
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
              ...PaginationInfo
            }
            nodes {
              ...ResearchSummaryDetails
            }
          }
        }

        ... on VideoSeriesCategory {
          videoSeriesItems(
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
              ...PaginationInfo
            }
            nodes {
              ...VideoItemSummary
            }
          }
        }
      }
    }
  }
`
