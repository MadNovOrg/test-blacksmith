import { Box, InputBase } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

type Props = {
  onChange: (feedback: string) => void
}

export const GradingFeedbackInput: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation()
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    onChange(feedback)
  }, [feedback, onChange])

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.common.white,
        borderBottom: `2px solid ${theme.palette.grey[500]}`,
        padding: theme.spacing(1, 2),
        marginBottom: theme.spacing(3),
        borderRadius: '2px',
      }}
    >
      <InputBase
        placeholder={t('pages.course-grading.feedback-field-placeholder')}
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        sx={{ display: 'block' }}
        data-testid="feedback-input"
      />
    </Box>
  )
}
