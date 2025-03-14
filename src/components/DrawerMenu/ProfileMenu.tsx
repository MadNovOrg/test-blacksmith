import AccountIcon from '@mui/icons-material/AccountCircle'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import EventIcon from '@mui/icons-material/Event'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import SchoolIcon from '@mui/icons-material/School'
import AdminIcon from '@mui/icons-material/SupervisorAccount'
import SupportIcon from '@mui/icons-material/Support'
import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import type { Profile } from '@app/types'

import { Avatar } from '../Avatar'

type ProfileMenuProps = {
  profile: Profile
}

export const ProfileMenu: React.FC<
  React.PropsWithChildren<ProfileMenuProps>
> = ({ profile }) => {
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
          <ListItemButton
            onClick={() => navigate(`/${verified ? 'profile' : 'verify'} `)}
          >
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

          <Link to={import.meta.env.VITE_WELCOME_PAGE_URL}>
            <ListItemButton onClick={() => navigate('/admin')}>
              <ListItemIcon>
                <SupportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="getting-started-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                {t('help-centre')}
              </ListItemText>
            </ListItemButton>
          </Link>

          {acl.isInternalUser() ? (
            <>
              <Link
                to={
                  acl.isAustralia()
                    ? import.meta.env.VITE_KNOWLEDGE_HUB_URL_ANZ
                    : import.meta.env.VITE_KNOWLEDGE_HUB_URL
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    data-testid="admin-link"
                    primaryTypographyProps={{ variant: 'body2' }}
                  >
                    {t('knowledge-hub')}
                  </ListItemText>
                </ListItemButton>
              </Link>

              <Link
                to={
                  acl.isAustralia()
                    ? import.meta.env.VITE_EVENTS_URL_ANZ
                    : import.meta.env.VITE_EVENTS_URL
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <EventIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    data-testid="admin-link"
                    primaryTypographyProps={{ variant: 'body2' }}
                  >
                    {t('events')}
                  </ListItemText>
                </ListItemButton>
              </Link>

              <Link
                to={
                  acl.isAustralia()
                    ? import.meta.env.VITE_SUPPORT_URL_ANZ
                    : import.meta.env.VITE_SUPPORT_URL
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <HelpCenterIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    data-testid="admin-link"
                    primaryTypographyProps={{ variant: 'body2' }}
                  >
                    {t('support')}
                  </ListItemText>
                </ListItemButton>
              </Link>
            </>
          ) : null}

          <ListItemButton onClick={() => logout()}>
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
