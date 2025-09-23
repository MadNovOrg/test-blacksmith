import { gql, useMutation } from 'urql'

import {
  UpsertOrgResourcePacksPricingMutation,
  UpsertOrgResourcePacksPricingMutationVariables,
} from '@app/generated/graphql'

export const UPSERT_ORG_RESOURCE_PACKS_PRICING = gql`
  mutation UpsertOrgResourcePacksPricing(
    $input: org_resource_packs_pricing_insert_input!
  ) {
    insert_org_resource_packs_pricing_one(
      object: $input
      on_conflict: {
        constraint: org_resource_packs_pricing_resource_packs_pricing_id_organi_key
        update_columns: [AUD_price, NZD_price, synced_from_main]
      }
    ) {
      id
    }
  }
`

export const useUpsertOrgResourcePacksPricing = () => {
  const [result, mutationFn] = useMutation<
    UpsertOrgResourcePacksPricingMutation,
    UpsertOrgResourcePacksPricingMutationVariables
  >(UPSERT_ORG_RESOURCE_PACKS_PRICING)

  const wrappedMutationFn = (
    variables: UpsertOrgResourcePacksPricingMutationVariables['input'],
  ) => {
    return mutationFn({
      input: {
        ...variables,
        synced_from_main: false,
      },
    })
  }

  return [result, wrappedMutationFn] as const
}
