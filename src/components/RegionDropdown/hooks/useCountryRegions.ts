import { gql, useQuery } from 'urql'

import {
  GetRegionsByCountryQuery,
  GetRegionsByCountryQueryVariables,
} from '@app/generated/graphql'

export const REGIONS_BY_COUNTRY_QUERY = gql`
  query GetRegionsByCountry($country: String!) {
    regions: country_region(
      where: { country: { _eq: $country } }
      order_by: { name: asc }
    ) {
      name
    }
  }
`

export default function useCountryRegions(country: string | null) {
  const shouldPause = country === null

  const [response] = useQuery<
    GetRegionsByCountryQuery,
    GetRegionsByCountryQueryVariables
  >({
    query: REGIONS_BY_COUNTRY_QUERY,
    variables: {
      country: country as string,
    },
    pause: shouldPause,
  })

  return response.data?.regions.map(r => r.name) ?? []
}
