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
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import Spotlight from '@app/components/Spotlight/Spotlight'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  GetOrganisationDetailsQuery,
  Organization,
} from '@app/generated/graphql'
import { useProfileInsightsReportSplashScreen } from '@app/hooks/useProfileInsightsReportSplashScreen/useProfileInsightsReportSplashScreen'
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

const useExternalDashboard = (id: string | undefined) => {
  const { acl } = useAuth()

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

  return { showExternalDashboardUrl: Boolean(showExternalDashboardUrl) }
}

const useOrganizationData = (
  id: string | undefined,
  showExternalDashboardUrl: boolean,
) => {
  const { acl, profile } = useAuth()

  const isAustraliaRegion = acl.isAustralia()

  const queryParams = useMemo(
    () => ({
      orgId: ALL_ORGS,
      profileId: profile?.id,
      showAll: acl.canViewAllOrganizations(),
      shallow: true,
      withExternalDashboardUrl: showExternalDashboardUrl,
      withMainOrganisation: isAustraliaRegion,
      ...(id !== ALL_ORGS && id !== MERGE
        ? { withSpecificOrganisation: true, specificOrgId: id }
        : {}),
    }),
    [id, profile?.id, acl, showExternalDashboardUrl, isAustraliaRegion],
  )

  const { data: allOrgs, fetching, error } = useOrgV2(queryParams)

  const org = useMemo(
    () =>
      [...(allOrgs?.orgs ?? []), ...(allOrgs?.specificOrg ?? [])].find(
        o => o.id === id,
      ),
    [allOrgs, id],
  ) as
    | GetOrganisationDetailsQuery['specificOrg'][0]
    | GetOrganisationDetailsQuery['orgs'][0]

  return { allOrgs, org, fetching, error }
}

// Extracted component for affiliated organization display
const AffiliatedOrganization: React.FC<{
  mainOrg: Pick<Organization, 'id' | 'name'>
}> = ({ mainOrg }) => {
  const { acl } = useAuth()

  const { t } = useTranslation()

  if (acl.canViewOrg(mainOrg.id)) {
    return (
      <Typography data-testid="affiliated-with">
        {t('pages.org-details.main-organisation')}
        <Link data-testid="main-org-link" href={`/organisations/${mainOrg.id}`}>
          {mainOrg.name}
        </Link>
      </Typography>
    )
  }

  return (
    <Typography>
      {t('pages.org-details.main-organisation-plain-text', {
        orgName: mainOrg.name,
      })}
    </Typography>
  )
}

const ExternalUrlLink: React.FC<{
  onClick?: () => void
  url?: string
}> = ({ onClick, url }) => {
  const { t } = useTranslation()
  return (
    <Box
      id="external-url-link"
      display={'inline-flex'}
      gap={1}
      alignItems={'center'}
    >
      <InsightsIcon
        sx={{
          color: `${theme.colors.teal[500]}`,
        }}
      />
      <Link
        onClick={onClick}
        href={url ?? ''}
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

const SingleOrgHeader: React.FC<{
  org: GetOrganisationDetailsQuery['orgs'][number]
  showExternalDashboardUrl: boolean
}> = ({ org, showExternalDashboardUrl }) => {
  const { acl } = useAuth()

  const { t } = useTranslation()

  if (!org) return null

  return (
    <Box sx={{ mb: '10px' }}>
      <Typography variant="h1" sx={{ padding: '32px 10px 10px 0px' }}>
        {org.name}
      </Typography>
      {org.external_dashboard_url && showExternalDashboardUrl && (
        <ExternalUrlLink url={org.external_dashboard_url} />
      )}
      {acl.isOrgAdmin(org.id) && org.main_organisation && (
        <Typography>
          {t('pages.org-details.main-organisation-plain-text', {
            orgName: org.main_organisation.name,
          })}
        </Typography>
      )}
    </Box>
  )
}

// Extracted component for multiple organizations header
const MultipleOrgsHeader: React.FC<{
  id: string | undefined
  org: GetOrganisationDetailsQuery['orgs'][number]
  showExternalDashboardUrl: boolean
}> = ({ id, org, showExternalDashboardUrl }) => {
  const { t } = useTranslation()

  return (
    <Box display="flex" paddingBottom={5}>
      <Box width="100%" pr={4}>
        <Sticky top={20}>
          <Typography variant="h2" my={2} data-testid="org-title">
            {id !== ALL_ORGS
              ? org?.name
              : t('pages.org-details.all-organizations')}
          </Typography>
          {org?.main_organisation && (
            <AffiliatedOrganization mainOrg={org.main_organisation} />
          )}
          {org?.external_dashboard_url && showExternalDashboardUrl && (
            <ExternalUrlLink url={org.external_dashboard_url} />
          )}
        </Sticky>
      </Box>
    </Box>
  )
}

// Extracted component for main content
const OrgContent: React.FC<{
  id: string | undefined
  org: GetOrganisationDetailsQuery['orgs'][number]
  allOrgs: GetOrganisationDetailsQuery
}> = ({ id, org, allOrgs }) => {
  const hasMultipleOrgs = allOrgs?.orgs?.length > 1

  if (id === ALL_ORGS) {
    return <OrgOverviewTab orgId={ALL_ORGS} />
  }

  if (!hasMultipleOrgs) {
    return <Tabs organization={org} />
  }

  return <Tabs organization={org} />
}

// Extracted component for spotlight
const ExternalDashboardSpotlight: React.FC<{
  isVisible: boolean
  onClose: () => void
  org: GetOrganisationDetailsQuery['orgs'][number]
}> = ({ isVisible, onClose, org }) => {
  if (!isVisible) return null

  return (
    <Spotlight open={true} positionTargetId="external-url-link">
      <div style={{ padding: '8px' }}>
        <ExternalUrlLink
          onClick={onClose}
          url={org?.external_dashboard_url ?? ''}
        />
      </div>
    </Spotlight>
  )
}

// Main component with reduced complexity
export const OrgDashboard: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { showExternalDashboardUrl } = useExternalDashboard(id)
  const { allOrgs, org, fetching, error } = useOrganizationData(
    id,
    showExternalDashboardUrl,
  )

  const [spotlightExternalDashboardUrl, setSpotlightExternalDashboardUrl] =
    useState(false)

  const {
    managedOrgsWithDashboardUrls,
    insertSubmissionOfInsightsReportSplashScreen,
  } = useProfileInsightsReportSplashScreen()

  // Auto-redirect for single organization
  useEffect(() => {
    if (allOrgs?.orgs.length === 1) {
      navigate('/organisations/' + allOrgs.orgs[0].id)
    }
  }, [allOrgs, navigate])

  // Handle spotlight visibility
  useEffect(() => {
    const shouldShowSpotlight =
      managedOrgsWithDashboardUrls.length > 0 &&
      showExternalDashboardUrl &&
      org?.external_dashboard_url

    setSpotlightExternalDashboardUrl(Boolean(shouldShowSpotlight))
  }, [
    managedOrgsWithDashboardUrls.length,
    org?.external_dashboard_url,
    showExternalDashboardUrl,
  ])

  const handleSpotlightClose = () => {
    insertSubmissionOfInsightsReportSplashScreen()
    setSpotlightExternalDashboardUrl(false)
  }

  const hasMultipleOrgs = (allOrgs?.orgs?.length ?? 0) > 1
  const hasSingleOrg = allOrgs?.orgs?.length === 1

  return (
    <>
      <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
        <Helmet>
          <title>{t('pages.browser-tab-titles.organisations.title')}</title>
        </Helmet>

        {hasMultipleOrgs && <OrgSelectionToolbar prefix="/organisations" />}

        {fetching && (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="org-details-fetching"
          >
            <CircularProgress />
          </Stack>
        )}

        {!fetching && (
          <Container maxWidth="lg" sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error">
                {t('pages.org-details.org-not-found')}
              </Alert>
            )}

            {!error && (
              <>
                {hasSingleOrg && (
                  <SingleOrgHeader
                    org={org}
                    showExternalDashboardUrl={showExternalDashboardUrl}
                  />
                )}

                {hasMultipleOrgs && (
                  <MultipleOrgsHeader
                    id={id}
                    org={org}
                    showExternalDashboardUrl={showExternalDashboardUrl}
                  />
                )}

                {allOrgs ? (
                  <OrgContent id={id} org={org} allOrgs={allOrgs} />
                ) : null}
              </>
            )}
          </Container>
        )}
      </FullHeightPageLayout>

      <ExternalDashboardSpotlight
        isVisible={spotlightExternalDashboardUrl}
        onClose={handleSpotlightClose}
        org={org}
      />
    </>
  )
}
