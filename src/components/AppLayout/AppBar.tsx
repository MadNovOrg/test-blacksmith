import AccountIcon from '@mui/icons-material/AccountCircle'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Button, Tab, Tabs } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { RoleSwitcher } from '@app/components/RoleSwitcher'
import { useAuth } from '@app/context/auth'
import { useRouteMatch } from '@app/hooks/use-route-match'
import { useMainNavTabs } from '@app/hooks/useMainNavTabs'

import { Avatar } from '../Avatar'
import { DrawerMenu } from '../DrawerMenu'
import { Logo } from '../Logo'

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minHeight: 40,

  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    top: 0,
    height: '1px',
  },

  '& .MuiButtonBase-root': {
    textTransform: 'none',

    '&.Mui-selected': {
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
    },
  },
}))

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),

  '&.active': {
    fontWeight: '600',
  },
}))

export const AppBar = () => {
  const { t } = useTranslation()
  const { profile, logout } = useAuth()
  const [anchorElUser, setAnchorElUser] =
    React.useState<HTMLButtonElement | null>(null)

  const tabs = useMainNavTabs()
  const routeMatch = useRouteMatch(tabs)
  const currentTab = routeMatch?.pattern?.path ?? tabs[0].id

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  return (
    <>
      <MuiAppBar
        position="static"
        color="transparent"
        elevation={0}
        variant="outlined"
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <Link underline="none" href="/" variant="h5">
              <Logo
                width={230}
                height={48}
                variant="full"
                data-testid="app-logo"
              />
            </Link>
            <RoleSwitcher />
          </Box>
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            px={3}
            color="secondary.dark"
          >
            <Link component={StyledNavLink} to="/courses">
              Courses
            </Link>
            <Link component={StyledNavLink} to="/community">
              Community
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <Button
              onClick={handleOpenUserMenu}
              sx={{ mr: 2 }}
              startIcon={
                <Avatar src={profile?.avatar} name={profile?.fullName} />
              }
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
              <MenuItem>
                <ListItemIcon>
                  <AccountIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Link
                    underline="none"
                    href="/profile"
                    variant="body2"
                    data-testid="profile-link"
                  >
                    {t('my-profile')}
                  </Link>
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <NotificationsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Link
                    href="/notifications"
                    variant="body2"
                    data-testid="notifications-link"
                  >
                    {t('notifications')}
                  </Link>
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography variant="body2" data-testid="logout-link">
                    {t('logout')}
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <DrawerMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>

      <Box sx={{ justifyContent: 'space-between' }} marginTop="-1px">
        <StyledTabs value={currentTab} data-testid="main-nav">
          {tabs.map(t => (
            <Tab key={t.id} label={t.title} value={t.id} href={t.id} />
          ))}
        </StyledTabs>
      </Box>
    </>
  )
}
