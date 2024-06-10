import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { noop } from '@app/util'

type AttendeeMenuProps = {
  options: {
    id: string
    name: string | undefined | null
    avatar?: string | undefined | null
    archived?: boolean | undefined | null
  }[]
  value?: string
  placeholder?: string
  onSelect?: (_: string) => void
}

export const AttendeeMenu: React.FC<
  React.PropsWithChildren<AttendeeMenuProps>
> = ({ options, value, placeholder = '', onSelect = noop }) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const selected = useMemo(
    () => (value ? options.find(o => o.id === value) : null),
    [options, value]
  )

  return (
    <>
      <Button
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          bgcolor: 'common.white',
          justifyContent: 'space-between',
          py: 1.5,
          width: 250,
        }}
      >
        {selected ? selected.name : placeholder}
      </Button>
      <Menu
        id="demo-customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        PaperProps={{
          sx: { width: 250, mt: 2 },
          elevation: 1,
        }}
      >
        {options.map(u => (
          <MenuItem
            key={u.id}
            onClick={() => {
              onSelect(u.id)
              handleClose()
            }}
            disableRipple
          >
            <Avatar src={u.avatar ?? ''} name={u.name ?? ''} sx={{ mr: 1 }} />
            {u.archived ? t('common.archived-profile') : u.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
