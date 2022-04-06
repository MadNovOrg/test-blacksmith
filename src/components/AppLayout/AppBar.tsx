import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Button, Tab, Tabs } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
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
import { Link as RRLink } from 'react-router-dom'

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
            <Link
              underline="none"
              component={RRLink}
              to="/"
              variant="h5"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Logo size={40} data-testid="app-logo" />
              <Box sx={{ marginLeft: 2 }}>{t('appTitle')}</Box>
            </Link>

            <RoleSwitcher />
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
              sx={{ marginRight: 2, border: anchorElUser ? 1 : 0 }}
              startIcon={<ArrowDropDownIcon />}
              data-testid="user-menu-btn"
            >
              {profile?.fullName}
            </Button>
            <Menu
              elevation={1}
              sx={{ mt: '30px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <MenuItem>
                <ListItemText disableTypography>
                  <Link
                    component={RRLink}
                    to="/profile"
                    variant="body2"
                    data-testid="profile-link"
                  >
                    View or edit account
                  </Link>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ArrowForwardIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem>
                <ListItemText disableTypography>
                  <Link
                    component={RRLink}
                    to="/notifications"
                    variant="body2"
                    data-testid="notifications-link"
                  >
                    Notifications
                  </Link>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ArrowForwardIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemText disableTypography>
                  <Typography variant="body2" data-testid="logout-link">
                    Logout
                  </Typography>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            </Menu>
            <Avatar src={profile?.avatar} name={profile?.fullName} />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <DrawerMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>

      <Box sx={{ justifyContent: 'space-between' }} marginTop="-1px">
        <StyledTabs value={currentTab} data-testid="main-nav">
          {tabs.map(t => (
            <Tab
              key={t.id}
              label={t.title}
              value={t.id}
              component={RRLink}
              to={t.id}
            />
          ))}
        </StyledTabs>
      </Box>
    </>
  )
}
