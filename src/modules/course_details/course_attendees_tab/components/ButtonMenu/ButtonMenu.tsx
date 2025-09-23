import { Button, ButtonProps, Menu, MenuProps } from '@mui/material'
import React, { PropsWithChildren, useState } from 'react'

type Props = {
  label: string | React.ReactNode
  buttonProps?: ButtonProps
  menuProps?: MenuProps
}

export const ButtonMenu: React.FC<PropsWithChildren<Props>> = ({
  children,
  label,
  buttonProps,
  menuProps = {
    MenuListProps: { 'aria-labelledby': 'lock-button', role: 'listbox' },
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
  },
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant="contained"
        {...buttonProps}
        onClick={handleMenuButtonClick}
      >
        {label}
      </Button>

      <Menu
        {...menuProps}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  )
}
