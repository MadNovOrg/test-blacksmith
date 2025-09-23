import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Grade_Enum } from '@app/generated/graphql'

interface Props {
  grade: Grade_Enum
}

const gradeToIconMap = {
  PASS: <CheckCircleIcon color="success" />,
  OBSERVE_ONLY: <CheckCircleIcon color="tertiary" />,
  FAIL: <CancelIcon color="error" />,
  ASSIST_ONLY: <CheckCircleIcon color="tertiary" />,
  INCOMPLETE: <CancelIcon color="tertiary" />,
}

export const Grade: React.FC<React.PropsWithChildren<Props>> = ({
  grade,
  ...props
}) => {
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
