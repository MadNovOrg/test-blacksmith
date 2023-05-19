import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useUnmount } from 'react-use'

import { SnackbarMessageKey, useSnackbar } from '@app/context/snackbar'

export const SnackbarMessage: React.FC<
  React.PropsWithChildren<
    {
      messageKey: SnackbarMessageKey
    } & SnackbarProps &
      Pick<AlertProps, 'variant' | 'severity'>
  >
> = ({ messageKey, variant = 'outlined', severity = 'success', ...props }) => {
  const { getSnackbarMessage, removeSnackbarMessage } = useSnackbar()
  const message = getSnackbarMessage(messageKey)

  const [isOpen, setIsOpen] = useState(false)

  useUnmount(() => removeSnackbarMessage(messageKey))

  useEffect(() => {
    if (message) {
      setIsOpen(true)
    }
  }, [message])

  const handleClose = () => {
    setIsOpen(false)
    removeSnackbarMessage(messageKey)
  }

  return message ? (
    <Snackbar
      open={isOpen}
      autoHideDuration={15000}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      {...props}
      onClose={handleClose}
    >
      <Alert severity={severity} variant={variant}>
        {message?.label}
      </Alert>
    </Snackbar>
  ) : null
}
