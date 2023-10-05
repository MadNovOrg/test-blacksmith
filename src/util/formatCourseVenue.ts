import { t } from 'i18next'

import { CourseDeliveryType } from '@app/types'

export function formatCourseVenue(
  deliveryType: CourseDeliveryType,
  venue?: {
    name?: string
    city?: string
    country?: string | null
  }
): string {
  if (
    [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(deliveryType)
  ) {
    if (venue?.name || venue?.city || venue?.country) {
      return [venue?.name, venue?.city, venue?.country]
        .filter(Boolean)
        .join(', ')
    } else {
      return t('common.tbc')
    }
  } else if (deliveryType === CourseDeliveryType.VIRTUAL) {
    return t('common.course-delivery-type.VIRTUAL')
  }
  return ''
}

export function formatCourseVenueName(
  deliveryType: CourseDeliveryType,
  venueName?: string
): string {
  if (
    [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(deliveryType)
  ) {
    return venueName || t('common.tbc')
  } else if (deliveryType === CourseDeliveryType.VIRTUAL) {
    return t('common.course-delivery-type.VIRTUAL')
  }
  return ''
}
