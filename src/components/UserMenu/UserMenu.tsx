import AccountIcon from '@mui/icons-material/AccountCircle'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AdminIcon from '@mui/icons-material/SupervisorAccount'
import { Button } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { Avatar } from '../Avatar'

export const UserMenu: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, logout, acl, verified } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState<HTMLButtonElement | null>(
    null
  )

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleMenuClick = (path: string) => {
    setAnchorElUser(null)
    navigate(path)
  }

  return (
    <>
      <Button
        onClick={handleOpenUserMenu}
        startIcon={<Avatar src={profile?.avatar} name={profile?.fullName} />}
        endIcon={<ArrowDropDownIcon />}
        data-testid="user-menu-btn"
      >
        {profile?.fullName}
      </Button>
      <Menu
        elevation={1}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
        PaperProps={{ sx: { width: 220 } }}
      >
        <MenuItem onClick={() => handleMenuClick('/profile')}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            data-testid="profile-link"
            primaryTypographyProps={{ variant: 'body2' }}
          >
            {t('my-profile')}
          </ListItemText>
        </MenuItem>

        {!verified && (
          <MenuItem onClick={() => handleMenuClick('/verify')}>
            <ListItemIcon>
              <AlternateEmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              data-testid="verify-link"
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('verify')}
            </ListItemText>
          </MenuItem>
        )}

        {acl.canViewAdmin() && (
          <MenuItem onClick={() => handleMenuClick('/admin')}>
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              data-testid="admin-link"
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('admin')}
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={() => handleMenuClick('/notifications')}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            data-testid="notifications-link"
            primaryTypographyProps={{ variant: 'body2' }}
          >
            {t('notifications')}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={logout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            data-testid="logout-link"
            primaryTypographyProps={{ variant: 'body2' }}
          >
            {t('logout')}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
