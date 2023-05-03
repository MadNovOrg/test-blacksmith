import { Button, Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'

export type ConfirmDialogProps = {
  open: boolean
  title?: string | React.ReactNode
  message: string | React.ReactNode
  okLabel?: string
  cancelLabel?: string
  onOk: () => void
  onCancel: () => void
  'data-testid'?: string
}

export const ConfirmDialog: React.FC<
  React.PropsWithChildren<ConfirmDialogProps>
> = function ({
  open,
  title,
  message,
  okLabel,
  cancelLabel,
  onOk,
  onCancel,
  'data-testid': testId = 'ConfirmDialog',
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} title={title} data-testid={testId}>
      {message}
      <Grid container display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button
          type="button"
          variant="text"
          color="secondary"
          size="large"
          onClick={onCancel}
          data-testid="dialog-cancel-button"
          sx={{ mr: 2 }}
        >
          {cancelLabel ?? t('common.cancel')}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="large"
          onClick={onOk}
          data-testid="dialog-confirm-button"
        >
          {okLabel ?? t('common.confirm')}
        </Button>
      </Grid>
    </Dialog>
  )
}
