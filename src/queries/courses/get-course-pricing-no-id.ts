import { gql } from 'graphql-request'

import {
  Course_Pricing,
  Course_Pricing_Insert_Input,
} from '@app/generated/graphql'

export type ResponseType = {
  coursePricing?: Array<Course_Pricing>
}

export type ParamsType = Course_Pricing_Insert_Input

export const QUERY = gql`
  query GetCoursePricingNoId(
    $type: course_type_enum!
    $level: course_level_enum!
    $blended: Boolean!
    $reaccreditation: Boolean!
  ) {
    coursePricing: course_pricing(
      where: {
        type: { _eq: $type }
        level: { _eq: $level }
        blended: { _eq: $blended }
        reaccreditation: { _eq: $reaccreditation }
      }
    ) {
      id
      level
      type
      blended
      reaccreditation
      priceAmount
      priceCurrency
      xeroCode
    }
  }
`
