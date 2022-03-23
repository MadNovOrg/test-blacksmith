import React, { useMemo } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import { StepItem } from './StepItem'

interface Props {
  completedSteps: string[]
  steps: Array<{ key: string; label: string }>
}

export const StepsNavigation: React.FC<Props> = ({
  completedSteps,
  steps,
  ...props
}) => {
  const completedStepsSet = useMemo(() => {
    return new Set(completedSteps)
  }, [completedSteps])

  return (
    <Box {...props}>
      {steps.map((step, index) => (
        <StepItem
          key={step.key}
          completed={completedStepsSet.has(step.key)}
          index={index + 1}
        >
          <Typography fontWeight={completedStepsSet.has(step.key) ? 700 : 400}>
            {step.label}
          </Typography>
        </StepItem>
      ))}
    </Box>
  )
}
