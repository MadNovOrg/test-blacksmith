import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const EvaluationSummary = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Container sx={{ py: 2 }}>
      <Alert
        variant="outlined"
        color="warning"
        severity="warning"
        action={
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('../evaluation')}
          >
            {t('course-evaluation.complete-my-evaluation')}
          </Button>
        }
        sx={{ py: 1, '.MuiAlert-action': { alignItems: 'center', p: 0 } }}
      >
        {t('course-evaluation.trainer-evaluate')}
      </Alert>
    </Container>
  )
}
