import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { FC, useEffect, useMemo, useState } from 'react'
import {
  useNavigate,
  useNavigationType,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { AffiliatedOrgsTab } from '@app/modules/organisation/tabs/ANZ/AffiliatedOrgsTab/AffiliatedOrgsTab'
import { ResourcePacksPricingTab } from '@app/modules/organisation/tabs/ANZ/ResourcePacksPricingTab/ResourcePacksPricingTab'
import { ResourcePacksTab } from '@app/modules/organisation/tabs/ANZ/ResourcePacksTab/ResourcePacksTab'
import { LicensesTab } from '@app/modules/organisation/tabs/Licenses/LicensesTab'
import { OrgDetailsTab } from '@app/modules/organisation/tabs/OrganisationDetails'
import { OrgIndividualsTab } from '@app/modules/organisation/tabs/OrgIndividualsTab'
import { OrgOverviewTab } from '@app/modules/organisation/tabs/OrgOverviewTab'
import { OrgPermissionsTab } from '@app/modules/organisation/tabs/OrgPermissionsTab/OrgPermissionsTab'

export enum OrgDashboardTabs {
  OVERVIEW = 'OVERVIEW',
  DETAILS = 'DETAILS',
  AFFILIATED = 'AFFILIATED',
  INDIVIDUALS = 'INDIVIDUALS',
  LICENSES = 'LICENSES',
  RESOURCE_PACKS = 'RESOURCE_PACKS',
  RESOURCE_PACKS_PRICING = 'RESOURCE_PACKS_PRICING',
  PERMISSIONS = 'PERMISSIONS',
}

type Props = {
  organization:
    | GetOrganisationDetailsQuery['specificOrg'][0]
    | GetOrganisationDetailsQuery['orgs'][0]
    | null
}

const TabsWithProps = [
  {
    tab: OrgDashboardTabs.OVERVIEW,
    dataTestId: 'org-overview',
    label: t('pages.org-details.tabs.overview.title'),
    component: (id: string) => <OrgOverviewTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.DETAILS,
    dataTestId: 'org-details',
    label: t('pages.org-details.tabs.details.title'),
    component: (id: string) => <OrgDetailsTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.AFFILIATED,
    dataTestId: 'affiliated-orgs',
    label: t('pages.org-details.tabs.affiliated-orgs.title'),
    component: (id: string) => <AffiliatedOrgsTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.INDIVIDUALS,
    dataTestId: 'org-individuals',
    label: t('pages.org-details.tabs.users.title'),
    component: (id: string) => <OrgIndividualsTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.LICENSES,
    dataTestId: 'org-blended-licences',
    label: t('pages.org-details.tabs.licenses.title'),
    component: (id: string) => <LicensesTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.RESOURCE_PACKS,
    dataTestId: 'org-resource-packs',
    label: t('pages.org-details.tabs.resource-packs.title'),
    component: (id: string) => <ResourcePacksTab orgId={id} />,
  },
  {
    tab: OrgDashboardTabs.RESOURCE_PACKS_PRICING,
    dataTestId: 'org-resource-packs-pricing',
    label: t('pages.org-details.tabs.resource-pack-pricing.title'),
    component: () => <ResourcePacksPricingTab />,
  },
  {
    tab: OrgDashboardTabs.PERMISSIONS,
    dataTestId: 'org-permissions',
    label: t('pages.org-details.tabs.permissions.title'),
    component: (id: string) => <OrgPermissionsTab orgId={id} />,
  },
]

export const Tabs: FC<Props> = ({ organization }) => {
  const {
    acl: {
      isAustralia,
      canManageKnowledgeHubAccess,
      canViewResourcePacksPricing,
    },
  } = useAuth()
  const { id } = useParams()
  const navigationType = useNavigationType()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') as OrgDashboardTabs | null
  const [selectedTab, setSelectedTab] = useState<OrgDashboardTabs>(
    initialTab ?? OrgDashboardTabs.OVERVIEW,
  )

  const orgResourcePacksEnabled = useFeatureFlagEnabled('org-resource-packs')
  const hideResourcePacks = useMemo(
    () => !orgResourcePacksEnabled || !isAustralia(),
    [isAustralia, orgResourcePacksEnabled],
  )
  const showAffiliatedOrgsTab =
    isAustralia() && !organization?.main_organisation
  const OrgTabs = Object.values(TabsWithProps).filter(({ tab }) => {
    if (
      (!isAustralia() || organization?.main_organisation) &&
      tab === OrgDashboardTabs.AFFILIATED
    )
      return false
    if (!canManageKnowledgeHubAccess() && tab === OrgDashboardTabs.PERMISSIONS)
      return false
    if (
      (hideResourcePacks || !canViewResourcePacksPricing()) &&
      tab === OrgDashboardTabs.RESOURCE_PACKS_PRICING
    )
      return false
    return !(hideResourcePacks && tab === OrgDashboardTabs.RESOURCE_PACKS)
  })

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(location.search)
    const urlTab = currentSearchParams.get('tab') as OrgDashboardTabs
    const isPlaywright = Boolean(currentSearchParams.get('e2e'))

    const isPopNavigation = navigationType === 'POP'
    const isTabChanged = urlTab !== selectedTab

    if (isPopNavigation && !isPlaywright) {
      if (!urlTab) {
        navigate(-1)
        return
      }

      if (isTabChanged) {
        setSelectedTab(urlTab)
      }
      return
    }

    if (!isTabChanged) return

    if (selectedTab === OrgDashboardTabs.INDIVIDUALS) {
      currentSearchParams.set('tab', selectedTab)
      setSearchParams(currentSearchParams)
    } else {
      setSearchParams({ tab: selectedTab })
    }
  }, [selectedTab, setSelectedTab, setSearchParams, navigationType, navigate])
  const tabToDisplay = () => {
    if (selectedTab === OrgDashboardTabs.AFFILIATED && !showAffiliatedOrgsTab) {
      return OrgDashboardTabs.OVERVIEW
    }
    if (selectedTab === OrgDashboardTabs.RESOURCE_PACKS && hideResourcePacks) {
      return OrgDashboardTabs.OVERVIEW
    }
    return selectedTab
  }

  return (
    <TabContext value={tabToDisplay()}>
      <TabList
        onChange={(_, value) => {
          setSelectedTab(value)
        }}
        variant="scrollable"
      >
        {OrgTabs.map(({ tab, label, dataTestId }) => (
          <Tab key={tab} value={tab} label={label} data-testid={dataTestId} />
        ))}
      </TabList>
      {OrgTabs.map(({ tab, component }) => (
        <TabPanel key={tab} sx={{ p: 0 }} value={tab}>
          {id ? component(organization?.id) : null}
        </TabPanel>
      ))}
    </TabContext>
  )
}
