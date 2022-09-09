import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { CourseType } from '@app/types'

import { useCreateCourse } from '../CreateCourseProvider'

interface Props {
  completedSteps: string[]
  type: CourseType
}

export const CreateCourseSteps: React.FC<Props> = ({
  completedSteps,
  type,
}) => {
  const { t } = useTranslation()
  const { currentStepKey } = useCreateCourse()

  const steps = useMemo(() => {
    const courseDetailsStep = {
      key: 'course-details',
      label: t('pages.create-course.step-navigation-course-details'),
    }

    const assignTrainerStep = {
      key: 'assign-trainer',
      label: t('pages.create-course.step-navigation-assign-trainer'),
    }

    const trainerExpensesStep = {
      key: 'trainer-expenses',
      label: t('pages.create-course.step-navigation-trainer-expenses'),
    }

    const reviewAndConfirmStep = {
      key: 'review-and-confirm',
      label: t('pages.create-course.step-navigation-review-and-confirm'),
    }

    const courseBuilderStep = {
      key: 'course-builder',
      label: t('pages.create-course.step-navigation-course-builder'),
    }

    const steps = [courseDetailsStep]

    if (type !== CourseType.INDIRECT) {
      steps.push(assignTrainerStep)
    }

    if (type === CourseType.CLOSED) {
      steps.push(trainerExpensesStep)
      steps.push(reviewAndConfirmStep)
    } else {
      steps.push(courseBuilderStep)
    }

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
