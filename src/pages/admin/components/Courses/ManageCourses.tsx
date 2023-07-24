import { Alert, CircularProgress, Container, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/pages/admin/components/Organizations/OrgSelectionToolbar'
import { TrainerCourses } from '@app/pages/trainer-pages/MyCourses'
import { LoadingStatus } from '@app/util'

export const ManageCourses: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { orgId: id } = useParams()
  const { profile, acl } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const orgId = id ?? ALL_ORGS

  const { data: allOrgs } = useOrg(
    ALL_ORGS,
    profile?.id,
    acl.canViewAllOrganizations()
  )
  const { data, status } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  useEffect(() => {
    if (allOrgs && allOrgs.length === 1) {
      navigate('/manage-courses/' + allOrgs[0].id)
    }
  }, [allOrgs, navigate])

  return (
    <FullHeightPageLayout pb={3}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {allOrgs && allOrgs.length > 1 ? (
            <OrgSelectionToolbar prefix="/manage-courses" />
          ) : null}

          <Container maxWidth="lg" sx={{ pt: 2 }}>
            {status === LoadingStatus.ERROR ? (
              <Alert severity="error">
                {t('pages.org-details.org-not-found')}
              </Alert>
            ) : null}

            {data && status === LoadingStatus.SUCCESS ? (
              <TrainerCourses
                title={t('courses')}
                orgId={orgId}
                showAvailableCoursesButton={true}
              />
            ) : null}
          </Container>
        </>
      )}
    </FullHeightPageLayout>
  )
}
