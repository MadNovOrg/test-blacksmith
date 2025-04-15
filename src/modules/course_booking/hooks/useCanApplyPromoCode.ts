import { gql, useQuery } from 'urql'

import {
  CanApplyPromoCodeQuery,
  CanApplyPromoCodeQueryVariables,
} from '@app/generated/graphql'

export const CAN_APPLY_PROMO_CODE = gql`
  query CanApplyPromoCode($input: CanApplyPromoCodeInput!) {
    canApplyPromoCode(input: $input) {
      result {
        code
        amount
        type
      }
    }
  }
`

export const useCanApplyPromoCode = (code: string, courseId: number) => {
  const [{ data, error }] = useQuery<
    CanApplyPromoCodeQuery,
    CanApplyPromoCodeQueryVariables
  >({
    query: CAN_APPLY_PROMO_CODE,
    variables: {
      input: { code, courseId },
    },
  })

  return {
    data,
    error,
  }
}
