import { gql, useQuery } from 'urql'

import {
  GetOrgResourcePacksPricingsByOrgIdQuery,
  GetOrgResourcePacksPricingsByOrgIdQueryVariables,
} from '@app/generated/graphql'

export const GET_RESOURCE_PACKS_PRICINGS_BY_ORG_ID = gql`
  query getOrgResourcePacksPricingsByOrgId($organisation_id: uuid!) {
    org_resource_packs_pricing(
      where: { organisation_id: { _eq: $organisation_id } }
    ) {
      id
      resource_packs_pricing_id
      AUD_price
      NZD_price
    }
  }
`

export const useOrgResourcePacksPricingsByOrgId = (
  organisation_id: string | null | undefined,
) => {
  const [{ data, error, fetching }, refetch] = useQuery<
    GetOrgResourcePacksPricingsByOrgIdQuery,
    GetOrgResourcePacksPricingsByOrgIdQueryVariables
  >({
    query: GET_RESOURCE_PACKS_PRICINGS_BY_ORG_ID,
    variables: {
      organisation_id,
    },
    pause: !organisation_id,
  })

  return {
    data: data?.org_resource_packs_pricing,
    error,
    fetching,
    refetch,
  }
}
