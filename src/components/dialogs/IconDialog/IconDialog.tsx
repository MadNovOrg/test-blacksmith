import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  ClickAwayListener,
  Drawer,
  IconButton,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'

type IconDialogProps = {
  icon: React.ReactNode
}

/**
 * TODO Extract to popovers group
 */
export const IconDialog: React.FC<React.PropsWithChildren<IconDialogProps>> = ({
  icon,
  children,
  ...props
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!open) {
      setAnchorEl(event.currentTarget)
    }
    setOpen(prev => !prev)
  }

  const handleHover =
    (value: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) return
      if (value) {
        setAnchorEl(event.currentTarget)
      }
      setHover(value)
    }

  const dialogContent = (
    <Paper
      sx={{
        position: 'relative',
        mt: 1,
        p: 4,
        border: 1,
        borderColor: 'grey.400',
        [theme.breakpoints.down('md')]: {
          mt: 0,
          position: 'relative',
          width: '100%',
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
        },
      }}
    >
      {open && (
        <Box position="absolute" right={1} top={1}>
          <IconButton size="small" onClick={handleClick}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {children}
    </Paper>
  )

  return (
    <Box {...props}>
      <IconButton
        sx={{ color: 'white' }}
        size="small"
        onMouseEnter={handleHover(true)}
        onMouseLeave={handleHover(false)}
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      {!isMobile && (
        <Popper open={open || hover} anchorEl={anchorEl} placement="bottom">
          <ClickAwayListener
            onClickAway={() => setOpen(false)}
            mouseEvent="onMouseUp"
          >
            {dialogContent}
          </ClickAwayListener>
        </Popper>
      )}
      {isMobile && (
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
          {dialogContent}
        </Drawer>
      )}
    </Box>
  )
}
