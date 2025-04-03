import { gql, useMutation } from 'urql'

import {
  SaveNewOrgResourcePacksPricingMutation,
  SaveNewOrgResourcePacksPricingMutationVariables,
  UpdateOrgResourcePacksPricingMutation,
  UpdateOrgResourcePacksPricingMutationVariables,
} from '@app/generated/graphql'

export const SAVE_NEW_ORG_RESOURCE_PACKS_PRICING = gql`
  mutation SaveNewOrgResourcePacksPricing(
    $input: org_resource_packs_pricing_insert_input!
  ) {
    insert_org_resource_packs_pricing_one(object: $input) {
      id
    }
  }
`

export const UPDATE_ORG_RESOURCE_PACKS_PRICING = gql`
  mutation UpdateOrgResourcePacksPricing(
    $orgResourcePacksPricingId: uuid!
    $aud_price: numeric!
    $nzd_price: numeric!
  ) {
    update_org_resource_packs_pricing_by_pk(
      pk_columns: { id: $orgResourcePacksPricingId }
      _set: { AUD_price: $aud_price, NZD_price: $nzd_price }
    ) {
      id
      NZD_price
      AUD_price
    }
  }
`

export const useSaveNewOrgResourcePacksPricing = () => {
  return useMutation<
    SaveNewOrgResourcePacksPricingMutation,
    SaveNewOrgResourcePacksPricingMutationVariables
  >(SAVE_NEW_ORG_RESOURCE_PACKS_PRICING)
}

export const useUpdateOrgResourcePacksPricing = () => {
  return useMutation<
    UpdateOrgResourcePacksPricingMutation,
    UpdateOrgResourcePacksPricingMutationVariables
  >(UPDATE_ORG_RESOURCE_PACKS_PRICING)
}
