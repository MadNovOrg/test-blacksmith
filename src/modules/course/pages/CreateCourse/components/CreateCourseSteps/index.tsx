import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useMemo } from 'react'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { StepsEnum } from '@app/modules/course/pages/CreateCourse/types'

interface Props {
  blendedLearning?: boolean
  completedSteps: string[]
  currentStepKey?: string
  requireResourcePacks?: boolean
  type: Course_Type_Enum
}

export const CreateCourseSteps: React.FC<React.PropsWithChildren<Props>> = ({
  blendedLearning = false,
  completedSteps,
  currentStepKey,
  requireResourcePacks = false,
  type,
}) => {
  const { t } = useScopedTranslation('pages.create-course')
  const { acl } = useAuth()

  const enableIndirectCourseResourcePacks = useFeatureFlagEnabled(
    'indirect-course-resource-packs',
  )

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
      label: t('step-navigation-order-details'),
    }

    const orderDetailsStep = {
      key: StepsEnum.ORDER_DETAILS,
      label: t('step-navigation-order-details'),
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

    if (type !== Course_Type_Enum.Indirect) {
      steps.push(assignTrainerStep)
    }

    if (type === Course_Type_Enum.Indirect && acl.isInternalUser()) {
      steps.push(assignTrainerStep)
    }

    if (
      (blendedLearning ||
        requireResourcePacks ||
        enableIndirectCourseResourcePacks) &&
      type === Course_Type_Enum.Indirect
    ) {
      steps.push(licenseOrderDetailsStep)
      steps.push(reviewAndConfirmStep)
    }

    if (type === Course_Type_Enum.Closed) {
      steps.push(trainerExpensesStep)
      steps.push(orderDetailsStep)
      steps.push(reviewAndConfirmStep)
    } else if (!(type === Course_Type_Enum.Indirect && acl.isInternalUser())) {
      steps.push(courseBuilderStep)
    }

    return steps
  }, [
    t,
    type,
    acl,
    blendedLearning,
    requireResourcePacks,
    enableIndirectCourseResourcePacks,
  ])

  return (
    <StepsNavigation
      completedSteps={completedSteps}
      currentStepKey={currentStepKey ?? null}
      steps={steps}
      data-testid="create-course-nav"
    />
  )
}
