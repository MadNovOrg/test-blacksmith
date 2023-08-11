import Cancel from '@mui/icons-material/Cancel'
import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type RegistrantsCancellationModalProps = {
  onProceed: () => void
  onTransfer: () => void
}

export const RegistrantsCancellationModal: React.FC<
  React.PropsWithChildren<RegistrantsCancellationModalProps>
> = function ({ onProceed, onTransfer }) {
  const { t } = useTranslation()

  return (
    <Container data-testid="registrants-cancellation-modal">
      <Typography variant="body1" color="grey.600">
        {t('pages.edit-course.registrants-cancellation-modal.description')}
      </Typography>

      <Box display="flex" justifyContent="flex-end" mt={4} gap={1}>
        <Button
          variant="outlined"
          onClick={onProceed}
          startIcon={<Cancel color="error" />}
        >
          {t(
            'pages.edit-course.registrants-cancellation-modal.proceed-with-cancellation'
          )}
        </Button>
        <Button variant="contained" onClick={onTransfer}>
          {t(
            'pages.edit-course.registrants-cancellation-modal.transfer-attendees-first'
          )}
        </Button>
      </Box>
    </Container>
  )
}
