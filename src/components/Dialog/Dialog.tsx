import CloseIcon from '@mui/icons-material/Close'
import {
  IconButton,
  Dialog as MUIDialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import React from 'react'

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
          maxWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>{title ?? null}</div>
        {showClose ? (
          <IconButton
            data-testid={id ? `dialog-${id}-close` : 'dialog-close'}
            aria-label="close"
            onClick={onClose}
            sx={{
              mt: -0.5,
              ml: 1,
              mr: -1.5,
              color: 'grey.500',
              alignSelf: 'flex-start',
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
