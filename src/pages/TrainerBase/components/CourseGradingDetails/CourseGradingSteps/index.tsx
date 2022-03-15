import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { StepItem } from './StepItem'

interface Props {
  completedSteps: string[]
}

export const CourseGradingSteps: React.FC<Props> = ({ completedSteps }) => {
  const { t } = useTranslation()

  const items = [
    {
      key: 'attendance',
      label: t('pages.course-grading-details.attendance-step'),
    },
    { key: 'modules', label: t('pages.course-grading-details.modules-step') },
  ]

  return (
    <Box data-testid="course-grading-details-nav">
      {items.map((item, index) => (
        <StepItem
          key={item.key}
          completed={completedSteps.includes(item.key)}
          index={index + 1}
        >
          <Typography
            fontWeight={completedSteps.includes(item.key) ? 700 : 400}
          >
            {item.label}
          </Typography>
        </StepItem>
      ))}
    </Box>
  )
}
