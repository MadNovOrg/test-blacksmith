import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Menu, MenuItem } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IndividualRoleSwitcher } from '@app/components/RoleSwitcher/components/IndividualRolePicker'
import { RolePickerButton } from '@app/components/RoleSwitcher/components/RolePickerButton'
import { useAuth } from '@app/context/auth'
import { RoleName } from '@app/types'

export const RoleSwitcher = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [individualAnchorEl, setIndividualAnchorEl] =
    useState<HTMLLIElement | null>(null)

  const arrayIndividualAllowedRoles: RoleName[] = useMemo(
    () =>
      auth.individualAllowedRoles?.size
        ? Array.from(auth.individualAllowedRoles)
        : [],
    [auth.individualAllowedRoles],
  )

  const getRoleForPicker = useCallback(
    (role: RoleName) => {
      if (
        [RoleName.BOOKING_CONTACT, RoleName.ORGANIZATION_KEY_CONTACT].includes(
          role,
        ) &&
        auth.acl.isUserAndHaveUpToOneSubRole()
      ) {
        return RoleName.USER
      }

      return role
    },
    [auth.acl],
  )

  const getRoleOnChange = useCallback(
    (role: RoleName) => {
      if (
        role === RoleName.USER &&
        auth.acl.isUserAndHaveUpToOneSubRole() &&
        arrayIndividualAllowedRoles.length
      ) {
        return auth.acl.hasOrgAdmin()
          ? RoleName.USER
          : arrayIndividualAllowedRoles[0]
      }

      return role
    },
    [arrayIndividualAllowedRoles, auth.acl],
  )

  const roles = useMemo(() => {
    const availableRoles = [
      RoleName.FINANCE,
      RoleName.LD,
      RoleName.SALES_ADMIN,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.TRAINER,
      RoleName.TT_ADMIN,
      RoleName.TT_OPS,
      RoleName.USER,
    ]

    const all = [
      ...availableRoles.filter(role =>
        [...(auth?.allowedRoles ?? new Set())].includes(role),
      ),
    ]

    return all.filter(r => {
      // Keep the Individual option in case of multiple individual roles and chosen org admin (in case of org admin the active role is 'user')
      if (
        r === RoleName.USER &&
        !auth.acl.isUserAndHaveUpToOneSubRole() &&
        auth.acl.hasOrgAdmin()
      )
        return true
      return (
        r !==
        (auth.activeRole ? getRoleForPicker(auth.activeRole) : auth.activeRole)
      )
    })
  }, [auth.acl, auth.activeRole, auth?.allowedRoles, getRoleForPicker])

  const changeRole = (role: RoleName) => () => {
    auth.changeRole(getRoleOnChange(role))
    setAnchorEl(null)
    setIndividualAnchorEl(null)
    navigate('/')
  }

  if (!roles.length) return null

  const displayIndividualAsMenu = (role: RoleName) =>
    role === RoleName.USER && !auth.acl.isUserAndHaveUpToOneSubRole()

  return (
    <>
      <RolePickerButton setAnchorEl={setAnchorEl} />
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
        {roles.map(role =>
          displayIndividualAsMenu(role) ? (
            <MenuItem
              key={role}
              onClick={ev => setIndividualAnchorEl(ev.currentTarget)}
              sx={{ minWidth: 140, fontSize: 14 }}
              data-testid="RoleSwitcher-otherRole"
            >
              {t(`components.role-switcher.${role}`) || role}
              <ListItemIcon data-testid="RoleSwitcher-individual-arrow">
                <ArrowRightIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
          ) : (
            <MenuItem
              key={role}
              onClick={changeRole(role)}
              sx={{ minWidth: 140, fontSize: 14 }}
              data-testid="RoleSwitcher-otherRole"
            >
              {t(`components.role-switcher.${role}`) || role}
            </MenuItem>
          ),
        )}
      </Menu>
      {!auth.acl.isUserAndHaveUpToOneSubRole() ? (
        <IndividualRoleSwitcher
          anchor={[individualAnchorEl, setIndividualAnchorEl]}
          changeRole={changeRole}
          roles={[...arrayIndividualAllowedRoles]}
        />
      ) : null}
    </>
  )
}
