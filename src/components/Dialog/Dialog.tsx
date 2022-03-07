import React from 'react'
import {
  IconButton,
  Dialog as MUIDialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Props = {
  id?: string
  open: boolean
  title?: string | React.ReactNode
  showClose?: boolean
  onClose: () => void
  maxWidth?: number
}

export const Dialog: React.FC<Props> = ({
  id,
  open,
  title,
  showClose = true,
  onClose,
  children,
  maxWidth = 500,
}) => {
  return (
    <MUIDialog open={open} maxWidth={false} onClose={onClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title ?? null}
        {showClose ? (
          <IconButton
            data-testid={id ? `dialog-${id}-close` : 'dialog-close'}
            aria-label="close"
            onClick={onClose}
            sx={{
              ml: 2,
              mr: -1.5,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ maxWidth }}>{children}</DialogContent>
    </MUIDialog>
  )
}
