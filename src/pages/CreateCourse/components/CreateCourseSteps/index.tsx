import React from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'

interface Props {
  completedSteps: string[]
}

export const CreateCourseSteps: React.FC<Props> = ({ completedSteps }) => {
  const { t } = useTranslation()
  const steps = [
    {
      key: 'course-details',
      label: t('pages.create-course.step-navigation-course-details'),
    },
    {
      key: 'assign-trainer',
      label: t('pages.create-course.step-navigation-assign-trainer'),
    },
    {
      key: 'course-builder',
      label: t('pages.create-course.step-navigation-course-builder'),
    },
  ]

  return (
    <StepsNavigation
      completedSteps={completedSteps}
      steps={steps}
      data-testid="create-course-nav"
    />
  )
}
