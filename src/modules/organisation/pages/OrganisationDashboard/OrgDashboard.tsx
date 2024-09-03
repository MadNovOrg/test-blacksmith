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
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/modules/organisation/components/OrgSelectionToolbar/OrgSelectionToolbar'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { OrgDetailsTab as ANZOrgDetailsTab } from '@app/modules/organisation/tabs/ANZ/OrgDetailsTab'
import { OrgDetailsTab as UKOrgDetailsTab } from '@app/modules/organisation/tabs/OrgDetailsTab'
import { OrgIndividualsTab } from '@app/modules/organisation/tabs/OrgIndividualsTab'
import { OrgOverviewTab } from '@app/modules/organisation/tabs/OrgOverviewTab'
import theme from '@app/theme'
import { ALL_ORGS } from '@app/util'

import { AffiliatedOrgsTab } from '../../tabs/AffiliatedOrgsTab'
import { LicensesTab } from '../../tabs/Licenses/LicensesTab'
import { OrgPermissionsTab } from '../../tabs/OrgPermissionsTab/OrgPermissionsTab'

export enum OrgDashboardTabs {
  OVERVIEW = 'OVERVIEW',
  DETAILS = 'DETAILS',
  AFFILIATED = 'AFFILIATED',
  INDIVIDUALS = 'INDIVIDUALS',
  LICENSES = 'LICENSES',
  PERMISSIONS = 'PERMISSIONS',
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
  const isAustraliaRegion = acl.isAustralia()
  const isUKRegion = acl.isUK()
  const {
    data: allOrgs,
    fetching,
    error,
  } = useOrgV2({
    orgId: ALL_ORGS,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    shallow: true,
    ...(id !== ALL_ORGS
      ? { withSpecificOrganisation: true, specificOrgId: id }
      : []),
  })

  const org = useMemo(
    () =>
      [...(allOrgs?.orgs ?? []), ...(allOrgs?.specificOrg ?? [])].find(
        o => o.id === id,
      ),
    [allOrgs, id],
  )

  useEffect(() => {
    if (allOrgs && allOrgs.orgs.length === 1) {
      return navigate('/organisations/' + allOrgs.orgs[0].id)
    }
  }, [allOrgs, navigate, org, id])

  const initialTab = searchParams.get('tab') as OrgDashboardTabs | null
  const [selectedTab, setSelectedTab] = useState(
    initialTab ?? OrgDashboardTabs.OVERVIEW,
  )

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
      <Helmet>
        <title>{t('pages.browser-tab-titles.organisations.title')}</title>
      </Helmet>
      <>
        {allOrgs && allOrgs.orgs.length > 1 ? (
          <OrgSelectionToolbar prefix="/organisations" />
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

            {allOrgs?.orgs.length === 1 ? (
              <Typography variant="h1" p={4}>
                {org?.name}
              </Typography>
            ) : null}

            {!fetching && !error ? (
              <>
                {allOrgs && allOrgs.orgs.length > 1 ? (
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
                    <TabList
                      onChange={(_, value) => setSelectedTab(value)}
                      variant="scrollable"
                    >
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
                      {isAustraliaRegion && !org?.main_organisation ? (
                        <Tab
                          label={t(
                            'pages.org-details.tabs.affiliated-orgs.title',
                          )}
                          value={OrgDashboardTabs.AFFILIATED}
                          data-testid="affiliated-orgs"
                        />
                      ) : null}
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
                      {acl.canManageKnowledgeHubAccess() ? (
                        <Tab
                          label={t('pages.org-details.tabs.permissions.title')}
                          value={OrgDashboardTabs.PERMISSIONS}
                          data-testid="org-permissions"
                        />
                      ) : null}
                    </TabList>

                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.OVERVIEW}>
                      {id ? <OrgOverviewTab orgId={id} /> : null}
                    </TabPanel>

                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.DETAILS}>
                      {isUKRegion ? (
                        <UKOrgDetailsTab orgId={id} />
                      ) : (
                        <ANZOrgDetailsTab orgId={id} />
                      )}
                    </TabPanel>

                    {isAustraliaRegion && !org?.main_organisation ? (
                      <TabPanel
                        sx={{ p: 0 }}
                        value={OrgDashboardTabs.AFFILIATED}
                      >
                        <AffiliatedOrgsTab orgId={id} />
                      </TabPanel>
                    ) : null}

                    <TabPanel
                      sx={{ p: 0 }}
                      value={OrgDashboardTabs.INDIVIDUALS}
                    >
                      <OrgIndividualsTab orgId={id} />
                    </TabPanel>
                    <TabPanel sx={{ p: 0 }} value={OrgDashboardTabs.LICENSES}>
                      <LicensesTab orgId={id} />
                    </TabPanel>
                    {acl.canManageKnowledgeHubAccess() ? (
                      <TabPanel
                        sx={{ p: 0 }}
                        value={OrgDashboardTabs.PERMISSIONS}
                      >
                        <OrgPermissionsTab orgId={id} />
                      </TabPanel>
                    ) : null}
                  </TabContext>
                ) : (
                  <OrgOverviewTab orgId={ALL_ORGS} />
                )}
              </>
            ) : null}
          </Container>
        )}
      </>
    </FullHeightPageLayout>
  )
}
