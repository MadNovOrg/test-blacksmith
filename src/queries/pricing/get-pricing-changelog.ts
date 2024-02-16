import { gql } from 'graphql-request'

export const GET_PRICING_CHANGELOG = gql`
  query PricingChangelog(
    $where: course_pricing_changelog_bool_exp
    $limit: Int = 5
    $offset: Int = 0
  ) {
    course_pricing_changelog(
      order_by: { createdAt: desc }
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      newPrice
      oldPrice
      createdAt
      author {
        id
        fullName
        avatar
        archived
      }
    }
    course_pricing_changelog_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
