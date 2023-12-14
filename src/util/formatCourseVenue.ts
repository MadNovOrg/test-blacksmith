import { t } from 'i18next'

import {
  CourseDeliveryType,
  Course_Delivery_Type_Enum,
  Venue,
} from '@app/generated/graphql'

export function formatCourseVenue(
  deliveryType: Course_Delivery_Type_Enum,
  venue?: Venue
): string {
  if (
    [Course_Delivery_Type_Enum.F2F, Course_Delivery_Type_Enum.Mixed].includes(
      deliveryType
    )
  ) {
    if (venue?.name || venue?.city || venue?.country) {
      return [
        venue?.name,
        venue?.addressLineOne,
        venue?.addressLineTwo,
        venue?.city,
        venue?.postCode,
        venue?.country,
      ]
        .filter(Boolean)
        .join(', ')
    } else {
      return t('common.tbc')
    }
  } else if (deliveryType === Course_Delivery_Type_Enum.Virtual) {
    return t('common.course-delivery-type.VIRTUAL')
  }
  return ''
}

export function formatCourseVenueName(
  deliveryType: Course_Delivery_Type_Enum | CourseDeliveryType,
  venueName?: string
): string {
  if (
    [
      Course_Delivery_Type_Enum.F2F,
      Course_Delivery_Type_Enum.Mixed,
      CourseDeliveryType.F2F,
      CourseDeliveryType.Mixed,
    ].includes(deliveryType)
  ) {
    return venueName || t('common.tbc')
  } else if (deliveryType === Course_Delivery_Type_Enum.Virtual) {
    return t('common.course-delivery-type.VIRTUAL')
  }
  return ''
}
