import { TFunction } from 'i18next'

import { Course_Pricing } from '@app/generated/graphql'

// Returns a string of comma separated course attributes
export function getCourseAttributes(
  t: TFunction,
  coursePricing?: Course_Pricing | null,
): string {
  return [
    coursePricing?.reaccreditation && t('reaccreditation'),
    coursePricing?.blended && t('blended-learning'),
  ]
    .filter(Boolean)
    .join(', ')
}
