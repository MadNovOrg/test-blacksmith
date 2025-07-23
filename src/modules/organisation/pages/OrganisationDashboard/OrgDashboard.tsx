import InsightsIcon from '@mui/icons-material/Insights'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Link,
} from '@mui/material'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  GetOrganisationDetailsQuery,
  Organization,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/modules/organisation/components/OrgSelectionToolbar/OrgSelectionToolbar'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import theme from '@app/theme'
import { ALL_ORGS, MERGE } from '@app/util'

import { OrgOverviewTab } from '../../tabs/OrgOverviewTab'

import { Tabs } from './components/Tabs'

export enum CertificationStatus {
  ACTIVE,
  EXPIRING_SOON,
  EXPIRED,
}

export const OrgDashboard: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { profile, acl } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAustraliaRegion = acl.isAustralia()
  const externalDashboardUrlEnabled = useFeatureFlagEnabled(
    'external-dashboard-url-enabled',
  )

  const showExternalDashboardUrl = useMemo(
    () =>
      externalDashboardUrlEnabled &&
      (acl.isAdmin() || acl.isOrgAdmin()) &&
      id !== ALL_ORGS &&
      id !== MERGE,
    [id, externalDashboardUrlEnabled, acl],
  )

  const {
    data: allOrgs,
    fetching,
    error,
  } = useOrgV2({
    orgId: ALL_ORGS,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    shallow: true,
    withExternalDashboardUrl: showExternalDashboardUrl,
    withMainOrganisation: isAustraliaRegion,
    ...(id !== ALL_ORGS && id !== MERGE
      ? { withSpecificOrganisation: true, specificOrgId: id }
      : []),
  })

  const org = useMemo(
    () =>
      [...(allOrgs?.orgs ?? []), ...(allOrgs?.specificOrg ?? [])].find(
        o => o.id === id,
      ),
    [allOrgs, id],
  ) as
    | GetOrganisationDetailsQuery['specificOrg'][0]
    | GetOrganisationDetailsQuery['orgs'][0]

  useEffect(() => {
    if (allOrgs && allOrgs.orgs.length === 1) {
      return navigate('/organisations/' + allOrgs.orgs[0].id)
    }
  }, [allOrgs, navigate, org, id])

  const affiliatedOrgAsPlainText = (orgName: string) => {
    return (
      <Typography>
        {t('pages.org-details.main-organisation-plain-text', {
          orgName: orgName,
        })}
      </Typography>
    )
  }

  const affiliatedOrgBasedOnRole = (
    mainOrg: Pick<Organization, 'id' | 'name'>,
  ) => {
    return acl.canViewOrg(mainOrg.id) ? (
      <Typography data-testid="affiliated-with">
        {t('pages.org-details.main-organisation')}
        <Link data-testid="main-org-link" href={`/organisations/${mainOrg.id}`}>
          {mainOrg.name}
        </Link>
      </Typography>
    ) : (
      affiliatedOrgAsPlainText(mainOrg.name)
    )
  }

  const ExternalUrlLink = () => {
    return (
      <Box display={'flex'} gap={1} alignItems={'center'}>
        <InsightsIcon
          sx={{
            color: `${theme.colors.teal[500]}`,
          }}
        />
        <Link
          href={org?.external_dashboard_url ?? ''}
          variant="h5"
          rel="noopener"
          target="_blank"
          underline="always"
          sx={{
            fontSize: '1rem',
            cursor: 'pointer',
            color: `${theme.colors.teal[500]}`,
          }}
        >
          {t('pages.org-details.insight-reports')}
        </Link>
      </Box>
    )
  }

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

            {allOrgs?.orgs?.length === 1 ? (
              <Box sx={{ mb: '10px' }}>
                <Typography variant="h1" sx={{ padding: '32px 10px 10px 0px' }}>
                  {org?.name}
                </Typography>
                {org?.external_dashboard_url && showExternalDashboardUrl ? (
                  <ExternalUrlLink />
                ) : null}
                {acl.isOrgAdmin(org?.id) && org?.main_organisation
                  ? affiliatedOrgAsPlainText(org.main_organisation.name)
                  : null}
              </Box>
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
                        {org?.main_organisation
                          ? affiliatedOrgBasedOnRole(org.main_organisation)
                          : null}
                        {org?.external_dashboard_url &&
                        showExternalDashboardUrl ? (
                          <ExternalUrlLink />
                        ) : null}
                      </Sticky>
                    </Box>
                  </Box>
                ) : null}

                {id && id === ALL_ORGS ? (
                  <OrgOverviewTab orgId={ALL_ORGS} />
                ) : (
                  <Tabs organization={org} />
                )}
              </>
            ) : null}
          </Container>
        )}
      </>
    </FullHeightPageLayout>
  )
}
