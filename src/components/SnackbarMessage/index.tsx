import { Alert, Snackbar, SnackbarProps } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { SnackbarMessageKey, useSnackbar } from '@app/context/snackbar'

export const SnackbarMessage: React.FC<
  {
    messageKey: SnackbarMessageKey
  } & SnackbarProps
> = ({ messageKey, ...props }) => {
  const { getSnackbarMessage, removeSnackbarMessage } = useSnackbar()
  const message = getSnackbarMessage(messageKey)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(
    () => () => removeSnackbarMessage(messageKey),
    [messageKey, removeSnackbarMessage]
  )

  useEffect(() => {
    if (message) {
      setIsOpen(true)
    }
  }, [message])

  const handleClose = () => {
    setIsOpen(false)
    removeSnackbarMessage(messageKey)
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={15000}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      {...props}
      onClose={handleClose}
    >
      <Alert severity="success" variant="outlined">
        {message?.label}
      </Alert>
    </Snackbar>
  )
}
