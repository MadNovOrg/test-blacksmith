import { useCallback } from 'react'

import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const useResourcePacksPricingAttributes = () => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const getResourcePacksPricingAttributes = useCallback(
    ({
      courseType,
      reaccred,
    }: {
      courseType: Course_Type_Enum
      reaccred: boolean
    }) => {
      if (courseType === Course_Type_Enum.Indirect)
        return (
          t('table.alias.non-reaccreditation') +
          ', ' +
          t('table.alias.reaccreditation')
        )

      return t(
        `table.alias.${reaccred ? 'reaccreditation' : 'non-reaccreditation'}`,
      )
    },
    [t],
  )

  return getResourcePacksPricingAttributes
}
