import { Alert, CircularProgress, Container, Stack } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/modules/organisation/components/OrgSelectionToolbar/OrgSelectionToolbar'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import { TrainerCourses } from '@app/modules/trainer_courses/pages/MyCourses'
import {
  ManageContactRoleCourses,
  ManageContactRoleCoursesProps,
} from '@app/modules/user_courses/pages/ManageContactRoleCourses/ManageContactRoleCourses'
import { RoleName } from '@app/types'

import { useBookingContactCountOpenCourses } from '../../hooks/useBookingContactCountOpenCourses'

export const ManageCourses: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { orgId: id } = useParams()
  const { profile, acl } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const orgId = id ?? undefined

  const contact = useMemo(() => {
    if (acl.isBookingContact()) return RoleName.BOOKING_CONTACT
    if (acl.isOrgKeyContact()) return RoleName.ORGANIZATION_KEY_CONTACT
  }, [acl])

  const { data: allOrgs } = useOrgV2({
    contact,
    profileEmail: profile?.email,
    profileId: profile?.id,
    shallow: true,
    showAll: acl.canViewAllOrganizations(),
  })
  const { data, fetching, error } = useOrgV2({
    contact,
    orgId,
    profileId: profile?.id,
    shallow: true,
    showAll: acl.canViewAllOrganizations(),
  })

  const countBookingContactOpenCourses = useBookingContactCountOpenCourses({
    bookingContactEmail: profile?.email as string,
    pause: !acl.isBookingContact(),
  })

  const navigateToOrgCourses = useMemo(() => {
    if (
      acl.isBookingContact() &&
      (countBookingContactOpenCourses.fetching ||
        countBookingContactOpenCourses.count > 0)
    ) {
      return false
    }

    return allOrgs && allOrgs.orgs.length === 1
  }, [
    acl,
    allOrgs,
    countBookingContactOpenCourses.count,
    countBookingContactOpenCourses.fetching,
  ])

  useEffect(() => {
    if (navigateToOrgCourses) {
      navigate(
        '/manage-courses/' +
          (allOrgs as GetOrganisationDetailsQuery).orgs[0].id,
      )
    }
  }, [
    acl,
    allOrgs,
    countBookingContactOpenCourses.count,
    countBookingContactOpenCourses.fetching,
    navigate,
    navigateToOrgCourses,
  ])

  const manageCoursesComponent = useMemo(() => {
    if (!contact)
      return (
        <TrainerCourses
          title={t('courses')}
          orgId={orgId}
          showAvailableCoursesButton={true}
        />
      )

    const contactManageCoursesProps: ManageContactRoleCoursesProps = {
      orgId,
      ...(acl.isBookingContact()
        ? { isBookingContact: true }
        : { isOrgKeyContact: true }),
    }

    return <ManageContactRoleCourses {...contactManageCoursesProps} />
  }, [acl, contact, orgId, t])

  return (
    <FullHeightPageLayout pb={3}>
      <Helmet>
        <title>{t('pages.browser-tab-titles.manage-courses.title')}</title>
      </Helmet>
      <>
        {allOrgs &&
        (allOrgs.orgs.length > 1 ||
          (acl.isBookingContact() &&
            countBookingContactOpenCourses.count > 0 &&
            allOrgs.orgs.length === 1)) ? (
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

            {data && !fetching && !error ? manageCoursesComponent : null}
          </Container>
        )}
      </>
    </FullHeightPageLayout>
  )
}
