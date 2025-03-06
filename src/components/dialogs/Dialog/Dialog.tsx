import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog as MUIDialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { PropsWithChildren, FC, ReactNode } from 'react'

type Props = {
  id?: string
  open: boolean

  /**
   * @deprecated Please use the `slots` prop
   */
  title?: string | React.ReactNode

  /**
   * @deprecated Please use the `slots` prop
   */
  subtitle?: string | React.ReactNode
  slots?: Partial<{
    Title: () => ReactNode
    Subtitle: () => ReactNode
    Content: () => ReactNode
    Actions: () => ReactNode
  }>
  showClose?: boolean
  onClose: () => void
  maxWidth?: number
  minWidth?: number
  'data-testid'?: string
  noPaddings?: boolean
}

export const Dialog: FC<PropsWithChildren<Props>> = ({
  id,
  open,
  title,
  subtitle,
  slots,
  showClose = true,
  onClose,
  children,
  maxWidth = 500,
  minWidth,
  'data-testid': testId,
  noPaddings = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <MUIDialog
      open={open}
      maxWidth={false}
      fullScreen={isMobile}
      onClose={onClose}
      data-testid={testId}
    >
      <DialogTitle
        sx={{
          maxWidth,
          minWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...(noPaddings ? {} : { padding: '1rem' }),
        }}
      >
        {slots?.Title || slots?.Subtitle ? (
          <div>
            {slots?.Title?.()}
            {slots?.Subtitle?.()}
          </div>
        ) : (
          <div>
            <div>{title ?? null}</div>
            {subtitle ? <div>{subtitle}</div> : null}
          </div>
        )}

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
      <DialogContent sx={{ maxWidth, minWidth }}>
        {slots?.Content ? slots?.Content?.() : children}
      </DialogContent>
      {slots?.Actions ? (
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 0,
            mx: noPaddings ? 1 : 3,
            mb: 3,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {slots?.Actions?.()}
        </DialogActions>
      ) : null}
    </MUIDialog>
  )
}
