import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, Menu, MenuItem, styled } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { RoleName } from '@app/types'

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderColor: 'transparent',
  color: theme.palette.grey[800],
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
    borderColor: 'transparent',
  },
}))

export const RoleSwitcher = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const roles = useMemo(() => {
    const availableRoles = [
      RoleName.USER,
      RoleName.TRAINER,
      RoleName.TT_OPS,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.SALES_ADMIN,
      RoleName.LD,
      RoleName.FINANCE,
      RoleName.TT_ADMIN,
    ]

    const all = [
      ...availableRoles.filter(role =>
        [...(auth?.allowedRoles ?? new Set())].includes(role)
      ),
    ]
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
      <StyledButton
        variant="outlined"
        size="small"
        color="primary"
        onClick={ev => setAnchorEl(ev.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
        data-testid="RoleSwitcher-btn"
      >
        {t(`components.role-switcher.${auth.activeRole}`) || auth.activeRole}
      </StyledButton>
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
            sx={{ minWidth: 140, fontSize: 14 }}
            data-testid="RoleSwitcher-otherRole"
          >
            {t(`components.role-switcher.${role}`) || role}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
