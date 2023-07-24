import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/pages/admin/components/Organizations/OrgSelectionToolbar'
import { OrgDetailsTab } from '@app/pages/admin/components/Organizations/tabs/OrgDetailsTab'
import { OrgIndividualsTab } from '@app/pages/admin/components/Organizations/tabs/OrgIndividualsTab'
import { OrgOverviewTab } from '@app/pages/admin/components/Organizations/tabs/OrgOverviewTab'
import theme from '@app/theme'
import { LoadingStatus } from '@app/util'

import { LicensesTab } from './tabs/Licenses/LicensesTab'

export enum OrgDashboardTabs {
  OVERVIEW = 'OVERVIEW',
  DETAILS = 'DETAILS',
  INDIVIDUALS = 'INDIVIDUALS',
  LICENSES = 'LICENSES',
}

export enum CertificationStatus {
  ACTIVE,
  EXPIRING_SOON,
  EXPIRED,
}

export const OrgDashboard: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { profile, acl } = useAuth()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: allOrgs, status } = useOrg(
    ALL_ORGS,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const org = useMemo(() => allOrgs?.find(o => o.id === id), [allOrgs, id])

  useEffect(() => {
    if (allOrgs && allOrgs.length === 1) {
      return navigate('/organisations/' + allOrgs[0].id)
    }

    if (id !== ALL_ORGS && allOrgs?.length && !org) {
      return navigate(`/organisations/${ALL_ORGS}`, { replace: true })
    }
  }, [allOrgs, navigate, org, id])

  const initialTab = searchParams.get('tab') as OrgDashboardTabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab || OrgDashboardTabs.OVERVIEW
  )

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
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
            <OrgSelectionToolbar prefix="/organisations" />
          ) : null}

          <Container maxWidth="lg" sx={{ pt: 2 }}>
            {status === LoadingStatus.ERROR ? (
              <Alert severity="error">
                {t('pages.org-details.org-not-found')}
              </Alert>
            ) : null}

            {allOrgs?.length === 1 ? (
              <Typography variant="h1" p={4}>
                {org?.name}
              </Typography>
            ) : null}

            {status === LoadingStatus.SUCCESS ? (
              <>
                {allOrgs && allOrgs.length > 1 ? (
                  <Box display="flex" paddingBottom={5}>
                    <Box width="100%" pr={4}>
                      <Sticky top={20}>
                        <Typography variant="h2" my={2} data-testid="org-title">
                          {id !== ALL_ORGS
                            ? org?.name
                            : t('pages.org-details.all-organizations')}
                        </Typography>
                      </Sticky>
                    </Box>
                  </Box>
                ) : null}

                {id && id !== ALL_ORGS ? (
                  <TabContext value={selectedTab}>
                    <TabList onChange={(_, value) => setSelectedTab(value)}>
                      <Tab
                        label={t('pages.org-details.tabs.overview.title')}
                        value={OrgDashboardTabs.OVERVIEW}
                        data-testid="org-overview"
                      />
                      <Tab
                        label={t('pages.org-details.tabs.details.title')}
                        value={OrgDashboardTabs.DETAILS}
                        data-testid="org-details"
                      />
                      <Tab
                        label={t('pages.org-details.tabs.users.title')}
                        value={OrgDashboardTabs.INDIVIDUALS}
                        data-testid="org-individuals"
                      />
                      <Tab
                        label={t('pages.org-details.tabs.licenses.title')}
                        value={OrgDashboardTabs.LICENSES}
                        data-testid="org-blended-licences"
                      />
                    </TabList>

                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.OVERVIEW}>
                      {id ? <OrgOverviewTab orgId={id} /> : null}
                    </TabPanel>

                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.DETAILS}>
                      <OrgDetailsTab orgId={id} />
                    </TabPanel>

                    <TabPanel
                      sx={{ p: 0 }}
                      value={OrgDashboardTabs.INDIVIDUALS}
                    >
                      <OrgIndividualsTab orgId={id} />
                    </TabPanel>
                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.LICENSES}>
                      <LicensesTab orgId={id} />
                    </TabPanel>
                  </TabContext>
                ) : (
                  <OrgOverviewTab orgId={ALL_ORGS} />
                )}
              </>
            ) : null}
          </Container>
        </>
      )}
    </FullHeightPageLayout>
  )
}
