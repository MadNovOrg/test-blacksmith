import { differenceInDays } from 'date-fns'

import { Promo_Code, Promo_Code_Type_Enum } from '@app/generated/graphql'
import { PromoCodeStatus } from '@app/types'

export const promoCodeNeedsApproval = (
  promoCode: Pick<Promo_Code, 'type' | 'amount'>
): boolean =>
  (promoCode.amount >= 15 && promoCode.type === Promo_Code_Type_Enum.Percent) ||
  (promoCode.amount > 3 && promoCode.type === Promo_Code_Type_Enum.FreePlaces)

export const getPromoCodeStatus = (
  promoCode: Pick<
    Promo_Code,
    | 'approvedBy'
    | 'deniedBy'
    | 'validFrom'
    | 'validTo'
    | 'type'
    | 'amount'
    | 'disabled'
  >
) => {
  if (promoCode.disabled) {
    return PromoCodeStatus.DISABLED
  }

  if ('approvedBy' in promoCode && promoCodeNeedsApproval(promoCode)) {
    if (promoCode.approvedBy === null && promoCode.deniedBy === null) {
      return PromoCodeStatus.APPROVAL_PENDING
    }
  }

  if (promoCode.deniedBy) {
    return PromoCodeStatus.DENIED
  }

  if (promoCode.validFrom) {
    const diff = differenceInDays(new Date(promoCode.validFrom), new Date())
    if (diff > 0) return PromoCodeStatus.SCHEDULED
  }

  if (promoCode.validTo) {
    const diff = differenceInDays(new Date(promoCode.validTo), new Date())
    if (diff < 0) return PromoCodeStatus.EXPIRED
  }

  return PromoCodeStatus.ACTIVE
}

export const DISCOUNT_STATUS_COLOR: Record<
  PromoCodeStatus,
  'gray' | 'warning' | 'success' | 'info' | 'error'
> = {
  [PromoCodeStatus.APPROVAL_PENDING]: 'warning',
  [PromoCodeStatus.ACTIVE]: 'success',
  [PromoCodeStatus.SCHEDULED]: 'info',
  [PromoCodeStatus.EXPIRED]: 'gray',
  [PromoCodeStatus.DENIED]: 'error',
  [PromoCodeStatus.DISABLED]: 'gray',
}
