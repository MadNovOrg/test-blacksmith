import { Button, Container, Grid } from '@mui/material'
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
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = function ({
  open,
  title,
  message,
  okLabel,
  cancelLabel,
  onOk,
  onCancel,
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <Container>
        {message}

        <Grid
          container
          display="flex"
          justifyContent="space-between"
          gap={2}
          mt={2}
        >
          <Button
            type="button"
            variant="text"
            color="secondary"
            size="large"
            onClick={onCancel}
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
          >
            {okLabel ?? t('common.confirm')}
          </Button>
        </Grid>
      </Container>
    </Dialog>
  )
}
