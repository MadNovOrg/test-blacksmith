import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { RoleName } from '@app/types'

export const RoleSwitcher = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const roles = useMemo(() => {
    const all = [...(auth.allowedRoles ?? new Set())]
    return all.filter(r => r !== auth.activeRole)
  }, [auth])

  const changeRole = (role: RoleName) => () => {
    auth.changeRole(role)
    setAnchorEl(null)
    navigate('/')
  }

  if (!roles.length) return null

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={ev => setAnchorEl(ev.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
        sx={{ borderRadius: 100, ml: 3, py: 0 }}
        data-testid="RoleSwitcher-btn"
      >
        {t(`components.role-switcher.${auth.activeRole}`) || auth.activeRole}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        data-testid="RoleSwitcher-list"
      >
        <MenuItem
          disabled={true}
          sx={{ textTransform: 'uppercase', fontSize: 11 }}
        >
          {t('components.role-switcher.subtitle')}
        </MenuItem>
        {roles.map(role => (
          <MenuItem
            key={role}
            onClick={changeRole(role)}
            sx={{ minWidth: 140 }}
            data-testid="RoleSwitcher-otherRole"
          >
            {t(`components.role-switcher.${role}`) || role}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
