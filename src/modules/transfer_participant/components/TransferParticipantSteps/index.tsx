import React from 'react'

import { StepsNavigation } from '@app/components/StepsNavigation'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { TransferStepsEnum } from '../../utils/types'
import { TransferModeEnum } from '../TransferParticipantProvider'

type Props = {
  completedSteps: TransferStepsEnum[]
  currentStepKey: TransferStepsEnum
  mode: TransferModeEnum
}

export const TransferParticipantSteps: React.FC<
  React.PropsWithChildren<Props>
> = ({ completedSteps, currentStepKey, mode }) => {
  const { t } = useScopedTranslation('pages.transfer-participant.steps')

  const steps: { key: TransferStepsEnum; label: string }[] = [
    {
      key: TransferStepsEnum.SELECT_COURSE,
      label: t(`step-${TransferStepsEnum.SELECT_COURSE}`),
    },
  ]

  if (mode !== TransferModeEnum.ATTENDEE_TRANSFERS) {
    steps.push({
      key: TransferStepsEnum.TRANSFER_DETAILS,
      label: t(`step-${TransferStepsEnum.TRANSFER_DETAILS}`),
    })
  }

  steps.push({
    key: TransferStepsEnum.REVIEW,
    label: t(`step-${TransferStepsEnum.REVIEW}`),
  })

  return (
    <StepsNavigation
      steps={steps}
      completedSteps={completedSteps}
      currentStepKey={currentStepKey}
    />
  )
}
