import { differenceInDays } from 'date-fns'

import { Promo_Code } from '@app/generated/graphql'
import { PromoCodeStatus } from '@app/types'

export const getPromoCodeStatus = (promoCode: Partial<Promo_Code>) => {
  if ('approvedBy' in promoCode) {
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

export const getPromoCodeStatusColor = (status: PromoCodeStatus) => {
  const colors = {
    [PromoCodeStatus.APPROVAL_PENDING]: '#FEF4E4',
    [PromoCodeStatus.ACTIVE]: '#F3F5E6',
    [PromoCodeStatus.SCHEDULED]: '#E1F2F4',
    [PromoCodeStatus.EXPIRED]: '#EEEEEE',
    [PromoCodeStatus.DENIED]: '#EEEEEE',
  }

  return colors[status]
}
