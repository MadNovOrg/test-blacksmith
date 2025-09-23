import { StepsNavigation } from '@app/components/StepsNavigation'

import { useImportContext } from './context'
import { Step } from './types'

type Props = {
  steps: Array<Step>
}

export const ImportSteps: React.FC<Props> = ({ steps }) => {
  const { currentStepKey, completedSteps } = useImportContext()

  return (
    <StepsNavigation
      steps={steps}
      currentStepKey={currentStepKey}
      completedSteps={completedSteps}
    />
  )
}
