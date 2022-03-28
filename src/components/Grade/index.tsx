import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'

import { Grade as GradeEnum } from '@app/types'

interface Props {
  grade: GradeEnum
}

const gradeToIconMap = {
  PASS: <CheckCircleIcon color="success" />,
  OBSERVE_ONLY: <CheckCircleIcon color="tertiary" />,
  FAIL: <CancelIcon color="error" />,
  ASSIST_ONLY: <CheckCircleIcon color="tertiary" />,
  INCOMPLETE: <CancelIcon color="tertiary" />,
}

export const Grade: React.FC<Props> = ({ grade, ...props }) => {
  const { t } = useTranslation()

  return (
    <Box display="inline-flex" {...props}>
      {gradeToIconMap[grade]}
      <Typography display="inline" variant="body1" sx={{ mx: 1 }}>
        {t(`common.grade.${grade}`)}
      </Typography>
    </Box>
  )
}
