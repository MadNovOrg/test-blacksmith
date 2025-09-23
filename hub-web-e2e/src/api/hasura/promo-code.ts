import { gql } from 'graphql-request'

import {
  CreateSamplePromoCodeMutation,
  CreateSamplePromoCodeMutationVariables,
  RemoveDiscountByCodeMutation,
  RemoveDiscountByCodeMutationVariables,
} from '@qa/generated/graphql'

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

export const removeByCode = async (code: string) => {
  const mutation = gql`
    mutation RemoveDiscountByCode($code: String!) {
      delete_promo_code(where: { code: { _eq: $code } }) {
        affected_rows
      }
    }
  `

  const response = await getClient().request<
    RemoveDiscountByCodeMutation,
    RemoveDiscountByCodeMutationVariables
  >(mutation, { code })

  return response.delete_promo_code
}

export const createSample = async (code: string) => {
  const mutation = gql`
    mutation CreateSamplePromoCode($code: String!) {
      insert_promo_code_one(
        object: {
          code: $code
          description: "Sample promo code"
          type: PERCENT
          amount: 5
          levels: []
          validFrom: "2022-01-01T00:00:00Z"
          validTo: null
          usesMax: null
          bookerSingleUse: true
          createdBy: "22015a3e-8907-4333-8811-85f782265a63"
          approvedBy: "22015a3e-8907-4333-8811-85f782265a63"
          courses: { data: [] }
        }
      ) {
        id
      }
    }
  `
  try {
    const response = await getClient().request<
      CreateSamplePromoCodeMutation,
      CreateSamplePromoCodeMutationVariables
    >(mutation, { code })

    return response.insert_promo_code_one
  } catch (e) {
    return null
  }
}
