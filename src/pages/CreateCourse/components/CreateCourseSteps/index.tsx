import React, { useMemo } from 'react'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CourseType } from '@app/types'

import { StepsEnum } from '../../types'

interface Props {
  completedSteps: string[]
  type: CourseType
  currentStepKey?: string
  blendedLearning?: boolean
}

export const CreateCourseSteps: React.FC<Props> = ({
  completedSteps,
  type,
  currentStepKey,
  blendedLearning = false,
}) => {
  const { t } = useScopedTranslation('pages.create-course')

  const steps = useMemo(() => {
    const courseDetailsStep = {
      key: StepsEnum.COURSE_DETAILS,
      label: t('step-navigation-course-details'),
    }

    const assignTrainerStep = {
      key: StepsEnum.ASSIGN_TRAINER,
      label: t('step-navigation-assign-trainer'),
    }

    const trainerExpensesStep = {
      key: StepsEnum.TRAINER_EXPENSES,
      label: t('step-navigation-trainer-expenses'),
    }

    const licenseOrderDetailsStep = {
      key: StepsEnum.LICENSE_ORDER_DETAILS,
      label: t('step-navigation-license-order-details'),
    }

    const reviewAndConfirmStep = {
      key: StepsEnum.REVIEW_AND_CONFIRM,
      label: t('step-navigation-review-and-confirm'),
    }

    const courseBuilderStep = {
      key: StepsEnum.COURSE_BUILDER,
      label: t('step-navigation-course-builder'),
    }

    const steps = [courseDetailsStep]

    if (type !== CourseType.INDIRECT) {
      steps.push(assignTrainerStep)
    }

    if (blendedLearning && type === CourseType.INDIRECT) {
      steps.push(licenseOrderDetailsStep)
      steps.push(reviewAndConfirmStep)
    }

    if (type === CourseType.CLOSED) {
      steps.push(trainerExpensesStep)
      steps.push(reviewAndConfirmStep)
    } else {
      steps.push(courseBuilderStep)
    }

    return steps
  }, [type, t, blendedLearning])

  return (
    <StepsNavigation
      completedSteps={completedSteps}
      currentStepKey={currentStepKey ?? null}
      steps={steps}
      data-testid="create-course-nav"
    />
  )
}
