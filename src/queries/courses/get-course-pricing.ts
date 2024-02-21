import { gql } from 'graphql-request'

export const GET_COURSE_PRICING_QUERY = gql`
  query GetCoursePricing($courseId: Int!) {
    pricing: getCoursePricing(input: { courseId: $courseId }) {
      priceAmount
      priceCurrency
      xeroCode
    }
  }
`
