import { gql, useMutation } from 'urql'

import {
  ApplyMainOrgResourcePacksPricingsToAffiliatesMutation,
  ApplyMainOrgResourcePacksPricingsToAffiliatesMutationVariables,
} from '@app/generated/graphql'

export const APPLY_MAIN_ORG_RESOURCE_PACKS_PRICING_TO_AFFILIATES = gql`
  mutation ApplyMainOrgResourcePacksPricingsToAffiliates(
    $affiliatesIds: [uuid!]!
    $pricings: [org_resource_packs_pricing_insert_input!]!
    $resourcePackPricingIdsForDefaultReset: [uuid!]!
  ) {
    delete_org_resource_packs_pricing(
      where: {
        organisation_id: { _in: $affiliatesIds }
        resource_packs_pricing_id: {
          _nin: $resourcePackPricingIdsForDefaultReset
        }
      }
    ) {
      affected_rows
    }

    insert_org_resource_packs_pricing(
      objects: $pricings
      on_conflict: {
        constraint: org_resource_packs_pricing_resource_packs_pricing_id_organi_key
        update_columns: [AUD_price, NZD_price, synced_from_main]
      }
    ) {
      affected_rows
    }
  }
`

export const useApplyOrgResourcePacksPriceOnAffiliates = () => {
  return useMutation<
    ApplyMainOrgResourcePacksPricingsToAffiliatesMutation,
    ApplyMainOrgResourcePacksPricingsToAffiliatesMutationVariables
  >(APPLY_MAIN_ORG_RESOURCE_PACKS_PRICING_TO_AFFILIATES)
}
