import Link from '@mui/material/Link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

import { StyledNavLink } from '../StyledNavLink'

export const NavLinks = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  return (
    <>
      <Link component={StyledNavLink} to="/courses">
        {t('my-courses')}
      </Link>

      {acl.canManageOrgCourses() ? (
        <Link component={StyledNavLink} to="/manage-courses">
          {t('courses')}
        </Link>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Link component={StyledNavLink} to="/organizations">
          {t('organizations')}
        </Link>
      ) : null}

      {acl.isTTAdmin() ? (
        <Link component={StyledNavLink} to="/admin/contacts">
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
    </>
  )
}
