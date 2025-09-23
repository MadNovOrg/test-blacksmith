import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useUnmount } from 'react-use'

import { SnackbarMessageKey, useSnackbar } from '@app/context/snackbar'

export const SnackbarMessage: React.FC<
  React.PropsWithChildren<
    {
      messageKey: SnackbarMessageKey
      alertProps?: AlertProps
    } & SnackbarProps &
      Pick<AlertProps, 'variant' | 'severity'>
  >
> = ({
  messageKey,
  variant = 'outlined',
  alertProps,
  severity = 'success',
  ...props
}) => {
  const { getSnackbarMessage, removeSnackbarMessage } = useSnackbar()
  const message = useMemo(
    () => getSnackbarMessage(messageKey),
    [getSnackbarMessage, messageKey],
  )

  const [isOpen, setIsOpen] = useState(false)

  useUnmount(() => removeSnackbarMessage(messageKey))

  useEffect(() => {
    setIsOpen(Boolean(message?.label))
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
      onClose={handleClose}
      {...props}
    >
      <Alert severity={severity} variant={variant} {...alertProps}>
        {message?.label}
      </Alert>
    </Snackbar>
  ) : null
}
