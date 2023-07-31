import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog as MUIDialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import React from 'react'

type Props = {
  id?: string
  open: boolean
  title?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  showClose?: boolean
  onClose: () => void
  maxWidth?: number
  minWidth?: number
  'data-testid'?: string
}

export const Dialog: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  open,
  title,
  subtitle,
  showClose = true,
  onClose,
  children,
  maxWidth = 500,
  minWidth,
  'data-testid': testId,
}) => {
  return (
    <MUIDialog
      open={open}
      maxWidth={false}
      onClose={onClose}
      data-testid={testId}
      aria-labelledby={typeof title === 'string' ? title : ''}
    >
      <DialogTitle
        sx={{
          maxWidth,
          minWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div>{title ?? null}</div>
          {subtitle ? <div>{subtitle}</div> : null}
        </div>

        {showClose ? (
          <IconButton
            data-testid={id ? `dialog-${id}-close` : 'dialog-close'}
            aria-label="close"
            onClick={onClose}
            sx={{
              mt: -0.5,
              ml: 1,
              mr: -1.5,
              color: 'grey.600',
              alignSelf: 'flex-start',
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ maxWidth, minWidth }}>{children}</DialogContent>
    </MUIDialog>
  )
}
