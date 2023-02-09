import { t } from 'i18next'

import { CourseDeliveryType } from '@app/types'

export function formatCourseVenue(
  deliveryType: CourseDeliveryType,
  venue?: {
    name?: string
    city?: string
  }
): string {
  if (
    [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(deliveryType)
  ) {
    if (venue?.name || venue?.city) {
      return [venue?.name, venue?.city].filter(Boolean).join(', ')
    } else {
      return t('common.tbc')
    }
  } else if (deliveryType === CourseDeliveryType.VIRTUAL) {
    return t('common.course-delivery-type.VIRTUAL')
  }
  return ''
}
