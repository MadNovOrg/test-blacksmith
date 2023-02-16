import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useMemo } from 'react'

import { StepItem } from './StepItem'

interface Props {
  completedSteps: string[]
  currentStepKey: string | null
  steps: Array<{ key: string; label: string }>
}

export const StepsNavigation: React.FC<React.PropsWithChildren<Props>> = ({
  completedSteps,
  currentStepKey,
  steps,
  ...props
}) => {
  const completedStepsSet = useMemo(() => {
    return new Set(completedSteps)
  }, [completedSteps])

  return (
    <Box {...props}>
      {steps.map((step, index) => {
        const stepLabelIsEmphasised =
          completedStepsSet.has(step.key) || steps[index].key === currentStepKey

        return (
          <StepItem
            key={step.key}
            completed={completedStepsSet.has(step.key)}
            index={index + 1}
            line={steps.length - 1 !== index}
          >
            <Typography fontWeight={stepLabelIsEmphasised ? 700 : 400}>
              {step.label}
            </Typography>
          </StepItem>
        )
      })}
    </Box>
  )
}
