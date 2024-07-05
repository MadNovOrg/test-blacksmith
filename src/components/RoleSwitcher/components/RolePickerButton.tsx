import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, styled } from '@mui/material'
import React, { Dispatch, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { mapRegularUserRoleIntoDisplayed } from '@app/components/RoleSwitcher/utils'
import { useAuth } from '@app/context/auth'

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderColor: 'transparent',
  color: theme.palette.grey[800],
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
    borderColor: 'transparent',
  },
}))

type RolePickerButtonProps = {
  setAnchorEl: Dispatch<React.SetStateAction<HTMLButtonElement | null>>
}

export const RolePickerButton = ({ setAnchorEl }: RolePickerButtonProps) => {
  const auth = useAuth()
  const { t } = useTranslation()

  const roleNameToDisplay = useMemo(
    () =>
      mapRegularUserRoleIntoDisplayed({
        activeRole: auth.activeRole,
        only: auth.acl.isUserAndHaveUpToOneSubRole(),
        isOrgAdmin: auth.acl.hasOrgAdmin(),
      }),
    [auth.acl, auth.activeRole],
  )

  return (
    <StyledButton
      variant="outlined"
      size="small"
      color="primary"
      onClick={ev => setAnchorEl(ev.currentTarget)}
      endIcon={<ArrowDropDownIcon />}
      data-testid="RoleSwitcher-btn"
    >
      {roleNameToDisplay
        ? t(roleNameToDisplay)
        : t(`components.role-switcher.${auth.activeRole}`) || auth.activeRole}
    </StyledButton>
  )
}
