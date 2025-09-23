import { gql } from 'urql'

export const UPSERT_PROMO_CODE = gql`
  mutation UpsertPromoCode(
    $promoCondition: promo_code_bool_exp
    $promoCode: promo_code_insert_input!
  ) {
    delete_course_promo_code(where: { promo_code: $promoCondition }) {
      affected_rows
    }
    insert_promo_code_one(
      object: $promoCode
      on_conflict: {
        constraint: promo_code_pkey
        update_columns: [
          code
          description
          type
          createdBy
          amount
          validFrom
          validTo
          levels
          usesMax
          bookerSingleUse
          approvedBy
        ]
      }
    ) {
      id
    }
  }
`
