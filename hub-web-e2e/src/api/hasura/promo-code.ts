import { gql } from 'graphql-request'

import { getClient } from './client'

export const remove = async (id: string): Promise<string> => {
  const mutation = gql`
    mutation RemovePromoCode($id: uuid!) {
      delete_promo_code_by_pk(id: $id) {
        id
      }
    }
  `
  const variables = { id }
  const response: { delete_promo_code_by_pk: { id: string } } =
    await getClient().request(mutation, variables)
  return response.delete_promo_code_by_pk.id
}
