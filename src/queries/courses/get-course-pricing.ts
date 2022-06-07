import { gql } from 'graphql-request'

import type { Fetcher } from '@app/hooks/use-fetcher'
import { Currency } from '@app/types'

export type ResponseType = {
  pricing?: {
    priceAmount: number
    priceCurrency: Currency
    xeroCode: string
  }
}

export const QUERY = gql`
  query GetCoursePricing($courseId: Int!) {
    pricing: getCoursePricing(input: { courseId: $courseId }) {
      priceAmount
      priceCurrency
      xeroCode
    }
  }
`

export const GetCoursePricing = async (
  fetcher: Fetcher,
  courseId: number
): Promise<ResponseType> => {
  try {
    return await fetcher(QUERY, { courseId })
  } catch (err) {
    return {}
  }
}
