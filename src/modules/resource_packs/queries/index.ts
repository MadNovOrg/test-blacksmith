import { gql } from 'urql'

export const GET_RESOURCE_PACK_PRICINGS = gql`
  query GetResourcePackPricings(
    $course_type: course_type_enum!
    $course_level: course_level_enum!
    $course_delivery_type: course_delivery_type_enum!
    $reaccreditation: Boolean = false
    $currency: String = "AUD"
  ) {
    anz_resource_packs_pricing(
      where: {
        _and: {
          course_delivery_type: { _eq: $course_delivery_type }
          course_level: { _eq: $course_level }
          course_type: { _eq: $course_type }
          currency: { _eq: $currency }
          reaccred: { _eq: $reaccreditation }
        }
      }
    ) {
      id
      price
      currency
    }
  }
`
