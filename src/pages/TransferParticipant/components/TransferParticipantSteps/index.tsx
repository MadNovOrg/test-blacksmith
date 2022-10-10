import React from 'react'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { TransferStepsEnum } from '../../types'

type Props = {
  completedSteps: TransferStepsEnum[]
  currentStepKey: TransferStepsEnum
}

export const TransferParticipantSteps: React.FC<Props> = ({
  completedSteps,
  currentStepKey,
}) => {
  const { t } = useScopedTranslation('pages.transfer-participant.steps')

  const steps: { key: TransferStepsEnum; label: string }[] = [
    {
      key: TransferStepsEnum.SELECT_COURSE,
      label: t(`step-${TransferStepsEnum.SELECT_COURSE}`),
    },
    {
      key: TransferStepsEnum.TRANSFER_DETAILS,
      label: t(`step-${TransferStepsEnum.TRANSFER_DETAILS}`),
    },
    {
      key: TransferStepsEnum.REVIEW,
      label: t(`step-${TransferStepsEnum.REVIEW}`),
    },
  ]

  return (
    <StepsNavigation
      steps={steps}
      completedSteps={completedSteps}
      currentStepKey={currentStepKey}
    />
  )
}
