import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { t } from 'i18next'
import { FC, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { AffiliatedOrgsTab } from '@app/modules/organisation/tabs/ANZ/AffiliatedOrgsTab/AffiliatedOrgsTab'
import { LicensesTab } from '@app/modules/organisation/tabs/Licenses/LicensesTab'
import { OrgDetailsTab } from '@app/modules/organisation/tabs/OrganisationDetails'
import { OrgIndividualsTab } from '@app/modules/organisation/tabs/OrgIndividualsTab'
import { OrgOverviewTab } from '@app/modules/organisation/tabs/OrgOverviewTab'
import { OrgPermissionsTab } from '@app/modules/organisation/tabs/OrgPermissionsTab/OrgPermissionsTab'
import { ALL_ORGS } from '@app/util'

export enum OrgDashboardTabs {
  OVERVIEW = 'OVERVIEW',
  DETAILS = 'DETAILS',
  AFFILIATED = 'AFFILIATED',
  INDIVIDUALS = 'INDIVIDUALS',
  LICENSES = 'LICENSES',
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
    tab: OrgDashboardTabs.PERMISSIONS,
    dataTestId: 'org-permissions',
    label: t('pages.org-details.tabs.permissions.title'),
    component: (id: string) => <OrgPermissionsTab orgId={id} />,
  },
]

export const Tabs: FC<Props> = ({ organization }) => {
  const {
    acl: { isAustralia, canManageKnowledgeHubAccess },
  } = useAuth()
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') as OrgDashboardTabs | null
  const [selectedTab, setSelectedTab] = useState<OrgDashboardTabs>(
    initialTab || OrgDashboardTabs.OVERVIEW,
  )

  const showAffiliatedOrgsTab =
    isAustralia() && !organization?.main_organisation

  const OrgTabs = Object.values(TabsWithProps).filter(({ tab }) => {
    if (!isAustralia() && !organization?.main_organisation)
      return tab !== OrgDashboardTabs.AFFILIATED
    if (!canManageKnowledgeHubAccess())
      return tab !== OrgDashboardTabs.PERMISSIONS
    return true
  })

  if (id && id === ALL_ORGS) {
    return <OrgOverviewTab orgId={ALL_ORGS} />
  }

  return (
    <TabContext
      value={
        selectedTab === OrgDashboardTabs.AFFILIATED && !showAffiliatedOrgsTab
          ? OrgDashboardTabs.OVERVIEW
          : selectedTab
      }
    >
      <TabList
        onChange={(_, value) => {
          setSelectedTab(value)
          setSearchParams({ tab: value })
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
