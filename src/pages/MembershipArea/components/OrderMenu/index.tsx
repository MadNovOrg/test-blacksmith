import { ArrowDropDown, Sort } from '@mui/icons-material'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { OrderDirection } from '@app/generated/graphql'
import theme from '@app/theme'

type Props = {
  onChange?: (order: OrderDirection) => void
}

export const OrderMenu: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const options = [
    {
      key: OrderDirection.Desc,
      label: t('pages.membership.components.order-menu.desc-order'),
    },
    {
      key: OrderDirection.Asc,
      label: t('pages.membership.components.order-menu.asc-order'),
    },
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (
    _event: unknown,
    index: React.SetStateAction<number>,
    key: OrderDirection
  ) => {
    setSelectedIndex(index)
    setAnchorEl(null)

    onChange(key)
  }

  return (
    <div>
      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<Sort />}
        endIcon={<ArrowDropDown />}
        data-testid="order-menu-button"
        sx={{
          backgroundColor: theme.palette.grey[200],
          color: theme.palette.text.secondary,
        }}
      >
        {options[selectedIndex].label}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.key}
            onClick={event => handleMenuItemClick(event, index, option.key)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
