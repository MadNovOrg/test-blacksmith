import { useTheme, useMediaQuery } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'

import { RoleSwitcher } from '@app/components/RoleSwitcher'
import { useAuth } from '@app/context/auth'

import { AppLogo } from '../AppLogo'
import { DrawerMenu } from '../DrawerMenu'
import { NavLinks } from '../NavLinks'
import { UserMenu } from '../UserMenu'

export const AppBar = () => {
  const { verified } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <MuiAppBar>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Link underline="none" href="/" variant="h5">
            <AppLogo
              width={isMobile ? undefined : 230}
              height={48}
              variant={isMobile ? 'partial' : 'full'}
              data-testid="app-logo"
            />
          </Link>
          <RoleSwitcher />
        </Box>
        {verified && (
          <Box
            display="flex"
            justifyContent="center"
            color="secondary.dark"
            sx={{
              flex: 1,
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
            }}
          >
            <NavLinks />
          </Box>
        )}
        <Box
          sx={{
            p: 0,
            flexGrow: 0,
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
          }}
        >
          <UserMenu />
        </Box>
        <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
          <DrawerMenu />
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}
