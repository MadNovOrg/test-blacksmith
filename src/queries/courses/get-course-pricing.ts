import { gql } from 'urql'

export const GET_COURSE_PRICING_QUERY = gql`
  query GetCoursePricing($courseId: Int!) {
    pricing: getCoursePricing(input: { courseId: $courseId }) {
      priceAmount
      priceCurrency
      xeroCode
    }
  }
`
