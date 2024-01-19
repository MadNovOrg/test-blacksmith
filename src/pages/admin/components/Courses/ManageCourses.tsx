import { Alert, CircularProgress, Container, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/modules/organisation/components/OrgSelectionToolbar/OrgSelectionToolbar'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { ManageContactRoleCourses } from '@app/pages/user-pages/MyCourses/ManageContactRoleCourses'
import { RoleName } from '@app/types'

export const ManageCourses: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { orgId: id } = useParams()
  const { profile, acl, activeRole } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const orgId = id ?? undefined

  const { data: allOrgs } = useOrgV2({
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    shallow: true,
  })
  const { data, fetching, error } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    shallow: true,
  })
  const navigateToOrgCourses =
    allOrgs &&
    allOrgs.orgs.length === 1 &&
    activeRole &&
    ![RoleName.BOOKING_CONTACT, RoleName.ORGANIZATION_KEY_CONTACT].includes(
      activeRole
    )

  useEffect(() => {
    if (navigateToOrgCourses) {
      navigate('/manage-courses/' + allOrgs.orgs[0].id)
    }
  }, [allOrgs, navigate, navigateToOrgCourses])

  return (
    <FullHeightPageLayout pb={3}>
      <Helmet>
        <title>{t('pages.browser-tab-titles.manage-courses.title')}</title>
      </Helmet>
      <>
        {allOrgs && allOrgs.orgs.length > 1 ? (
          <OrgSelectionToolbar prefix="/manage-courses" />
        ) : null}
        {fetching ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="org-details-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Container maxWidth="lg" sx={{ pt: 2 }}>
            {error ? (
              <Alert severity="error">
                {t('pages.org-details.org-not-found')}
              </Alert>
            ) : null}

            {data && !fetching && !error ? (
              acl.isBookingContact() ? (
                <ManageContactRoleCourses isBookingContact={true} />
              ) : acl.isOrgKeyContact() ? (
                <ManageContactRoleCourses isOrgKeyContact={true} />
              ) : (
                <TrainerCourses
                  title={t('courses')}
                  orgId={orgId}
                  showAvailableCoursesButton={true}
                />
              )
            ) : null}
          </Container>
        )}
      </>
    </FullHeightPageLayout>
  )
}
