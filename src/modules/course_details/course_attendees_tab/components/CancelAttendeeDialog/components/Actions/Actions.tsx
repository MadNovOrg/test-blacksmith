import { LoadingButton } from '@mui/lab'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type ActionsProps = {
  loading?: boolean
  disabled?: boolean
  onClose?: () => void
  onSubmit?: () => void
}

export const Actions: React.FC<ActionsProps> = ({
  loading,
  disabled,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Button
        data-testid="close-button"
        type="button"
        variant="text"
        color="primary"
        onClick={onClose}
        fullWidth={isMobile}
      >
        {t('common.close-modal')}
      </Button>
      <LoadingButton
        data-testid="cancelAttendee-button"
        loading={loading}
        disabled={disabled}
        onClick={onSubmit}
        type="button"
        variant="contained"
        color="error"
        fullWidth={isMobile}
      >
        {t('pages.individual-cancellation.cancel-attendee')}
      </LoadingButton>
    </>
  )
}
