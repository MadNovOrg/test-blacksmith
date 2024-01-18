import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

import { StyledNavLink } from '../StyledNavLink'

interface INavLinksProps {
  shownOnDrawer?: boolean
}

export const NavLinks: FC<INavLinksProps> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'center', lg: 'flex-start' },
      }}
    >
      <Link
        component={StyledNavLink}
        to={'/'}
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

      {!acl.isInternalUser() ? (
        <>
          <Link
            component={StyledNavLink}
            to={import.meta.env.VITE_KNOWLEDGE_HUB_URL}
          >
            {t('common.knowledge-hub')}
          </Link>

          <Link component={StyledNavLink} to={import.meta.env.VITE_EVENTS_URL}>
            {t('common.events')}
          </Link>

          <Link component={StyledNavLink} to={import.meta.env.VITE_SUPPORT_URL}>
            {t('common.support')}
          </Link>
        </>
      ) : null}
    </Box>
  )
}
