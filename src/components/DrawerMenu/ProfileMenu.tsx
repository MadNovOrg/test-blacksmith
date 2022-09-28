import AccountIcon from '@mui/icons-material/AccountCircle'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import OrgIcon from '@mui/icons-material/CorporateFare'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AdminIcon from '@mui/icons-material/SupervisorAccount'
import {
  Box,
  Button,
  Collapse,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import type { Profile } from '@app/types'

import { Avatar } from '../Avatar'

type ProfileMenuProps = {
  profile: Profile
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ profile }) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { acl, verified, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Box mx={5} pb={1} sx={{ borderBottom: 1, borderBottomColor: 'lime.500' }}>
      <Button
        onClick={() => setOpen(!open)}
        startIcon={
          <Box display={'flex'} alignItems={'center'}>
            <Avatar
              src={profile?.avatar}
              name={profile?.fullName}
              sx={{ marginRight: 1 }}
            />
            <Typography sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
              {profile?.fullName}
            </Typography>
          </Box>
        }
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        sx={{ width: '100%', justifyContent: 'space-between' }}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <AccountIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              data-testid="profile-link"
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('my-profile')}
            </ListItemText>
          </ListItemButton>

          {!verified && (
            <ListItemButton onClick={() => navigate('/verify')}>
              <ListItemIcon>
                <AlternateEmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="verify-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                {t('verify')}
              </ListItemText>
            </ListItemButton>
          )}

          {acl.canViewMyOrganization() && (
            <ListItemButton onClick={() => navigate('/my-organization')}>
              <ListItemIcon>
                <OrgIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="my-org-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                {t('my-org')}
              </ListItemText>
            </ListItemButton>
          )}

          {acl.canViewAdmin() && (
            <ListItemButton onClick={() => navigate('/admin')}>
              <ListItemIcon>
                <AdminIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="admin-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                {t('admin')}
              </ListItemText>
            </ListItemButton>
          )}

          <ListItemButton onClick={() => navigate('/notifications')}>
            <ListItemIcon>
              <NotificationsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              data-testid="notifications-link"
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('notifications')}
            </ListItemText>
          </ListItemButton>

          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              data-testid="logout-link"
              primaryTypographyProps={{ variant: 'body2' }}
            >
              {t('logout')}
            </ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  )
}
