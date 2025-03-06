import AccountIcon from '@mui/icons-material/AccountCircle'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import EventIcon from '@mui/icons-material/Event'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import SchoolIcon from '@mui/icons-material/School'
import AdminIcon from '@mui/icons-material/SupervisorAccount'
import SupportIcon from '@mui/icons-material/Support'
import { Button, Link } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { Avatar } from '../../modules/profile/components/Avatar'

export const UserMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, logout, acl, verified } = useAuth()
  const [anchorElUser, setAnchorElUser] = useState<HTMLButtonElement | null>(
    null,
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
        slotProps={{
          paper: { sx: { width: 220 } },
        }}
      >
        <MenuItem
          onClick={() =>
            handleMenuClick(`/${verified ? 'profile' : 'verify'} `)
          }
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

        {acl.canViewAdmin() ? (
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
        ) : null}

        <MenuItem>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            data-testid="getting-started-link"
            primaryTypographyProps={{ variant: 'body2' }}
          >
            <Link href={import.meta.env.VITE_WELCOME_PAGE_URL} underline="none">
              {t('help-centre')}
            </Link>
          </ListItemText>
        </MenuItem>

        {acl.isInternalUser() ? (
          // Added the DIV as a parent in order to get rid of the The Menu component doesn't accept a Fragment as a child.Consider providing an array instead.  error
          <div>
            <MenuItem>
              <ListItemIcon>
                <SchoolIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="admin-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                <Link
                  href={
                    acl.isAustralia()
                      ? import.meta.env.VITE_KNOWLEDGE_HUB_URL_ANZ
                      : import.meta.env.VITE_KNOWLEDGE_HUB_URL
                  }
                >
                  {t('common.knowledge-hub')}
                </Link>
              </ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <EventIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="admin-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                <Link
                  href={
                    acl.isAustralia()
                      ? import.meta.env.VITE_EVENTS_URL_ANZ
                      : import.meta.env.VITE_EVENTS_URL
                  }
                >
                  {t('common.events')}
                </Link>
              </ListItemText>
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <HelpCenterIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                data-testid="admin-link"
                primaryTypographyProps={{ variant: 'body2' }}
              >
                <Link
                  href={
                    acl.isAustralia()
                      ? import.meta.env.VITE_SUPPORT_URL_ANZ
                      : import.meta.env.VITE_SUPPORT_URL
                  }
                >
                  {t('common.support')}
                </Link>
              </ListItemText>
            </MenuItem>
          </div>
        ) : null}

        <Divider />

        <MenuItem onClick={() => logout()}>
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
