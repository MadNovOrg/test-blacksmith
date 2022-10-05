import { Alert, CircularProgress, Container, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { FullHeightPage } from '@app/components/FullHeightPage'
import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'
import { OrgSelectionToolbar } from '@app/pages/admin/components/Organizations/OrgSelectionToolbar'
import { MyCourses } from '@app/pages/user-pages/MyCourses'
import { LoadingStatus } from '@app/util'

export const ManageCourses: React.FC = () => {
  const { orgId: id } = useParams()
  const { profile, acl } = useAuth()
  const { t } = useTranslation()

  const orgId = id ?? ALL_ORGS

  const { data, status } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  return (
    <FullHeightPage pb={3}>
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
          <OrgSelectionToolbar prefix="/manage-courses" />

          <Container maxWidth="lg" sx={{ pt: 2 }}>
            {status === LoadingStatus.ERROR ? (
              <Alert severity="error">
                {t('pages.org-details.org-not-found')}
              </Alert>
            ) : null}

            {data && status === LoadingStatus.SUCCESS ? (
              <MyCourses title={t('courses')} orgId={orgId} />
            ) : null}
          </Container>
        </>
      )}
    </FullHeightPage>
  )
}
