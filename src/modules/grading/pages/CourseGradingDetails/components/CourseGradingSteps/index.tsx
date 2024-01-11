import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'

import { useGradingDetails } from '../GradingDetailsProvider'

export const CourseGradingSteps: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const { steps, currentStepKey, completedSteps } = useGradingDetails()

  const items = useMemo(() => {
    const items = []
    if (steps.includes('grading-clearance')) {
      items.push({
        key: 'grading-clearance',
        label: t('pages.course-grading-details.grading-clearance-step'),
      })
    }

    if (steps.includes('modules')) {
      items.push({
        key: 'modules',
        label: t('pages.course-grading-details.modules-step'),
      })
    }

    return items
  }, [steps, t])

  if (steps.length <= 1) {
    return null
  }

  return (
    <StepsNavigation
      steps={items}
      completedSteps={completedSteps}
      currentStepKey={currentStepKey}
      data-testid="course-grading-details-nav"
    />
  )
}
