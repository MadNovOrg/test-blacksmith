import { useTheme, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

import { StyledNavLink } from '../StyledNavLink'

interface INavLinksProps {
  shownOnDrawer?: boolean
}

export const NavLinks: React.FC<INavLinksProps> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
      }}
    >
      <Link
        component={StyledNavLink}
        to="/"
        sx={{ px: 2, textAlign: 'center' }}
      >
        {t('home')}
      </Link>

      {acl.canViewResources() ? (
        <Link
          component={StyledNavLink}
          to="/resources"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('resources')}
        </Link>
      ) : null}

      {acl.canParticipateInCourses() ? (
        <Link
          component={StyledNavLink}
          to="/courses"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('my-courses')}
        </Link>
      ) : null}

      {acl.canManageOrgCourses() ||
      acl.isBookingContact() ||
      acl.isOrgKeyContact() ? (
        <Link
          component={StyledNavLink}
          to="/manage-courses"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('manage-courses')}
        </Link>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Link
          component={StyledNavLink}
          to="/organisations"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('organizations')}
        </Link>
      ) : null}

      {acl.canViewUsers() ? (
        <Link
          component={StyledNavLink}
          to="/admin/users"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('users')}
        </Link>
      ) : null}

      {acl.canViewCertifications() && (
        <Link
          component={StyledNavLink}
          to="/certifications"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('common.certifications')}
        </Link>
      )}
      {acl.canViewOrders() && (
        <Link
          component={StyledNavLink}
          to="/orders"
          sx={{ px: 2, textAlign: 'center' }}
        >
          {t('common.orders')}
        </Link>
      )}
    </Box>
  )
}
