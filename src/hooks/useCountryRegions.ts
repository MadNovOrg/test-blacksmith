import { useQuery } from 'urql'

import {
  GetRegionsByCountryQuery,
  GetRegionsByCountryQueryVariables,
} from '@app/generated/graphql'
import { Query as REGIONS_BY_COUNTRY_QUERY } from '@app/queries/country-region/get-region-by-country'

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
