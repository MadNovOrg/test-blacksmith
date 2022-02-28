import * as React from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import { Link as RRLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/system'
import { Button, Tab, Tabs } from '@mui/material'

import { useAuth } from '@app/context/auth'

import { useRouteMatch } from '@app/hooks/use-route-match'

import { Icon } from '../Icon'
import { DrawerMenu } from '../DrawerMenu'

const Logo = styled(props => <Icon {...props} name="logo-color" />)({
  width: 40,
  height: 40,
})

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}))

// TODO: will be generated later based on user/role
const tabs = [
  {
    id: 'trainer-base',
    title: 'Trainer Base',
  },
  {
    id: 'my-training',
    title: 'My Training',
  },
  {
    id: 'my-organization',
    title: 'My Organization',
  },
  {
    id: 'admin',
    title: 'Admin',
  },
  {
    id: 'membership-area',
    title: 'Membership Area',
  },
]

export const AppBar = () => {
  const { t } = useTranslation()
  const { profile, logout } = useAuth()
  const [anchorElUser, setAnchorElUser] =
    React.useState<HTMLButtonElement | null>(null)
  const routeMatch = useRouteMatch(tabs)
  const currentTab = routeMatch?.pattern?.path ?? ''

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
            <Logo />
            <Link
              underline="none"
              component={RRLink}
              to="/"
              sx={{ marginLeft: 2 }}
              variant="h5"
            >
              {t('common.appTitle')}
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
              sx={{ marginRight: 2, border: anchorElUser ? 1 : 0 }}
              startIcon={<ArrowDropDownIcon />}
            >
              {profile?.givenName} {profile?.familyName}
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
                  <Link component={RRLink} to="/my-profile" variant="body2">
                    View or edit account
                  </Link>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ArrowForwardIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem>
                <ListItemText disableTypography>
                  <Link component={RRLink} to="/notifications" variant="body2">
                    Notifications
                  </Link>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ArrowForwardIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemText disableTypography>
                  <Typography variant="body2">Logout</Typography>
                </ListItemText>
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            </Menu>
            <Avatar
              alt="avatar"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
            />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <DrawerMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>

      <Box sx={{ justifyContent: 'space-between' }} marginTop="-1px">
        <StyledTabs value={currentTab}>
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
