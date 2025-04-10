import { gql, useMutation } from 'urql'

import {
  ApplyMainOrgResourcePacksPricingsToAffiliatesMutation,
  ApplyMainOrgResourcePacksPricingsToAffiliatesMutationVariables,
} from '@app/generated/graphql'

export const APPLY_MAIN_ORG_RESOURCE_PACKS_PRICING_TO_AFFILIATES = gql`
  mutation ApplyMainOrgResourcePacksPricingsToAffiliates(
    $pricings: [org_resource_packs_pricing_insert_input!]!
    $affiliatesIds: [uuid!]!
  ) {
    delete_org_resource_packs_pricing(
      where: { organisation_id: { _in: $affiliatesIds } }
    ) {
      affected_rows
    }
    insert_org_resource_packs_pricing(objects: $pricings) {
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
