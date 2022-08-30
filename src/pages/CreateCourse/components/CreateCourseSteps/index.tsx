import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { CourseType } from '@app/types'

interface Props {
  completedSteps: string[]
  currentStepKey: string | null
  type: CourseType
}

export const CreateCourseSteps: React.FC<Props> = ({
  completedSteps,
  currentStepKey,
  type,
}) => {
  const { t } = useTranslation()

  const steps = useMemo(() => {
    const courseDetailsStep = {
      key: 'course-details',
      label: t('pages.create-course.step-navigation-course-details'),
    }

    const assignTrainerStep = {
      key: 'assign-trainer',
      label: t('pages.create-course.step-navigation-assign-trainer'),
    }

    const courseBuilderStep = {
      key: 'course-builder',
      label: t('pages.create-course.step-navigation-course-builder'),
    }

    const steps = [courseDetailsStep]

    if (type !== CourseType.INDIRECT) {
      steps.push(assignTrainerStep)
    }

    steps.push(courseBuilderStep)

    return steps
  }, [type, t])

  return (
    <StepsNavigation
      completedSteps={completedSteps}
      currentStepKey={currentStepKey}
      steps={steps}
      data-testid="create-course-nav"
    />
  )
}
