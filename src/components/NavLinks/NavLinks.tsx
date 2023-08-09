import Link from '@mui/material/Link'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

import { StyledNavLink } from '../StyledNavLink'

export const NavLinks = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  return (
    <>
      <Link component={StyledNavLink} to="/">
        {t('home')}
      </Link>

      {acl.canViewResources() ? (
        <Link component={StyledNavLink} to="/resources">
          {t('resources')}
        </Link>
      ) : null}

      {acl.canParticipateInCourses() ? (
        <Link component={StyledNavLink} to="/courses">
          {t('my-courses')}
        </Link>
      ) : null}

      {acl.canManageOrgCourses() ? (
        <Link component={StyledNavLink} to="/manage-courses">
          {t('manage-courses')}
        </Link>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Link component={StyledNavLink} to="/organisations">
          {t('organizations')}
        </Link>
      ) : null}

      {acl.canViewUsers() ? (
        <Link component={StyledNavLink} to="/admin/users">
          {t('users')}
        </Link>
      ) : null}

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
    </>
  )
}
