import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { RoleSwitcher } from '@app/components/RoleSwitcher'
import { useAuth } from '@app/context/auth'

import { DrawerMenu } from '../DrawerMenu'
import { Logo } from '../Logo'
import { StyledNavLink } from '../StyledNavLink'
import { UserMenu } from '../UserMenu'

export const AppBar = () => {
  const { t } = useTranslation()
  const { acl, verified } = useAuth()

  return (
    <>
      <MuiAppBar>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={3}>
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
          {verified && (
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              px={3}
              color="secondary.dark"
            >
              <Link component={StyledNavLink} to="/courses">
                {t('courses')}
              </Link>

              {acl.isTTAdmin() ? (
                <Link component={StyledNavLink} to="/admin">
                  {t('contacts')}
                </Link>
              ) : null}

              <Link component={StyledNavLink} to="/community">
                {t('community')}
              </Link>
              {acl.canViewCertifications() && (
                <Link component={StyledNavLink} to="/certifications">
                  {t('common.certifications')}
                </Link>
              )}
              {acl.canViewOrders() && (
                <Link component={StyledNavLink} to="/orders">
                  {t('common.orders')}
                </Link>
              )}
              {acl.canViewMembership() && (
                <Link component={StyledNavLink} to="/membership">
                  {t('common.membership')}
                </Link>
              )}
            </Box>
          )}{' '}
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <UserMenu />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <DrawerMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </>
  )
}
