import Link from '@mui/material/Link'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { useAuth } from '@app/context/auth'
import {
  GetUserCanAccessResourcesQuery,
  GetUserCanAccessResourcesQueryVariables,
} from '@app/generated/graphql'
import { GET_USER_CAN_ACCESS_RESOURCES } from '@app/queries/certificate/get-user-can-access-resources'

import { StyledNavLink } from '../StyledNavLink'

export const NavLinks = () => {
  const { t } = useTranslation()
  const { acl, profile } = useAuth()

  const { data } = useSWR<
    GetUserCanAccessResourcesQuery,
    Error,
    [string, GetUserCanAccessResourcesQueryVariables]
  >([GET_USER_CAN_ACCESS_RESOURCES, { profileId: profile?.id }])

  const showResources =
    (data?.certificates.aggregate?.count ||
      0 + (data?.participant.aggregate?.count || 0)) > 0

  return (
    <>
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

      {acl.canViewResources(showResources) ? (
        <Link component={StyledNavLink} to="/resources">
          {t('resources')}
        </Link>
      ) : null}

      {acl.canViewUsers() ? (
        <Link component={StyledNavLink} to="/admin/users">
          {t('users')}
        </Link>
      ) : null}

      {acl.canViewOrganizations() ? (
        <Link component={StyledNavLink} to="/organisations">
          {t('organizations')}
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

      {acl.canViewMembership() && (
        <Link component={StyledNavLink} to="/membership">
          {t('common.membership')}
        </Link>
      )}
    </>
  )
}
