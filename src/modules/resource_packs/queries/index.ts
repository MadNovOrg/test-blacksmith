import { gql } from 'urql'

export const GET_RESOURCE_PACK_PRICINGS = gql`
  query GetResourcePackPricings($where: resource_packs_pricing_bool_exp!) {
    resource_packs_pricing(where: $where) {
      id
      AUD_price
      NZD_price
    }
  }
`
