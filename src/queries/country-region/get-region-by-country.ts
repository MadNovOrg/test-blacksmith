import { gql } from 'urql'

export const Query = gql`
  query GetRegionsByCountry($country: String!) {
    regions: country_region(
      where: { country: { _eq: $country } }
      order_by: { name: asc }
    ) {
      name
    }
  }
`
