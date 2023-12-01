import { gql } from 'graphql-request'

export const QUERY = gql`
  query Pricing(
    $where: course_pricing_bool_exp
    $limit: Int = 20
    $offset: Int = 0
  ) {
    course_pricing(
      order_by: [
        { level: asc }
        { type: desc }
        { reaccreditation: asc }
        { blended: asc }
      ]
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      level
      priceAmount
      priceCurrency
      reaccreditation
      type
      xeroCode
      blended
      updatedAt
      pricingSchedules(order_by: { effectiveFrom: asc }) {
        id
        coursePricingId
        effectiveFrom
        effectiveTo
        priceAmount
        priceCurrency
      }
      pricingSchedules_aggregate {
        aggregate {
          count
        }
        nodes {
          id
          coursePricingId
          effectiveFrom
          effectiveTo
          priceAmount
          priceCurrency
        }
      }
    }
    course_pricing_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
