import React from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'

interface Props {
  completedSteps: string[]
  currentStepKey: string | null
}

export const CourseGradingSteps: React.FC<Props> = ({
  completedSteps,
  currentStepKey,
}) => {
  const { t } = useTranslation()

  const items = [
    {
      key: 'grading-clearance',
      label: t('pages.course-grading-details.grading-clearance-step'),
    },
    { key: 'modules', label: t('pages.course-grading-details.modules-step') },
  ]

  return (
    <StepsNavigation
      steps={items}
      completedSteps={completedSteps}
      currentStepKey={currentStepKey}
      data-testid="course-grading-details-nav"
    />
  )
}
