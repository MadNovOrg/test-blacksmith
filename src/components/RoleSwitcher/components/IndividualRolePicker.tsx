import { Menu, MenuItem } from '@mui/material'
import React, { Dispatch, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { RoleName } from '@app/types'

type IndividualRoleSwitcherProps = {
  anchor: [
    HTMLLIElement | null,
    Dispatch<React.SetStateAction<HTMLLIElement | null>>
  ]
  changeRole: (role: RoleName) => () => void
  roles: RoleName[]
}

export const IndividualRoleSwitcher = ({
  anchor,
  changeRole,
  roles,
}: IndividualRoleSwitcherProps) => {
  const { t } = useTranslation()
  const auth = useAuth()

  const [anchorEl, setAnchorEl] = anchor

  const displayRoles = useMemo(() => {
    return roles.filter(r => {
      return r !== auth.activeRole
    })
  }, [auth.activeRole, roles])

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={() => setAnchorEl(null)}
      data-testid="RoleSwitcher-list-individual"
    >
      {displayRoles.map(r => (
        <MenuItem
          key={r}
          onClick={changeRole(r)}
          sx={{ minWidth: 140, fontSize: 14 }}
          data-testid={`Individual-role-${r}`}
        >
          {t(`components.role-switcher.${r}`) || r}
        </MenuItem>
      ))}
      {auth.acl.hasOrgAdmin() && auth.activeRole !== RoleName.USER ? (
        <MenuItem
          key={'organisation-admin'}
          onClick={changeRole(RoleName.USER)}
          sx={{ minWidth: 140, fontSize: 14 }}
          data-testid={`Individual-role-organisation-admin`}
        >
          {t('components.role-switcher.organization-admin')}
        </MenuItem>
      ) : null}
    </Menu>
  )
}
