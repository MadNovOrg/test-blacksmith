import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Stack,
  CircularProgress,
  Alert,
  Link,
  Tab,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  Certificate_Status_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import { useOrganisationProfilesByCertificateLevel } from '../../hooks/useOrganisationProfielsByCertificateLevel/useOrganisationProfielsByCertificateLevel'

import { IndividualsByLevelList } from './IndividualsByLevelList/IndividualsByLevelList'

type OrgIndividualsProps = {
  orgId: string
  certificateStatus: Certificate_Status_Enum[]
  setUserByLevelSelectedTab: (value: Course_Level_Enum | 'none') => void
  levelsToShow: Course_Level_Enum[]
  selectedTab: Course_Level_Enum | 'none'
}

export const OrgIndividuals: React.FC<OrgIndividualsProps> = ({
  orgId,
  certificateStatus,
  setUserByLevelSelectedTab,
  levelsToShow,
  selectedTab,
}) => {
  const { t } = useTranslation()
  const { fetching: profilesFetching, profilesByLevel } =
    useOrganisationProfilesByCertificateLevel()

  if (profilesFetching) {
    return (
      <Stack sx={{ alignItems: 'center' }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      {!profilesByLevel.size ? (
        <>
          {certificateStatus.length ? (
            <>
              <Typography variant="body1" sx={{ margin: '1em 1em' }}>
                {t('components.org-selector.no-individuals')}
              </Typography>
              <Typography variant="body2" sx={{ margin: '0em 1em' }}>
                {t('components.table-no-rows.noMatches-second')}
              </Typography>
            </>
          ) : (
            <Alert sx={{ mt: 2 }} severity="info">
              {t('pages.org-details.tabs.overview.no-org-users') + ' '}
              <Link href={'./invite'}>
                {t('pages.org-details.tabs.overview.click-here-to-invite')}
              </Link>
            </Alert>
          )}
        </>
      ) : (
        <TabContext value={selectedTab}>
          <TabList
            onChange={(_, value) => setUserByLevelSelectedTab(value)}
            sx={{ mt: 2 }}
            variant="scrollable"
            data-testid="individuals-by-level-tab-list"
          >
            {levelsToShow.map(courseLevel => (
              <Tab
                key={courseLevel}
                label={t(
                  `pages.org-details.tabs.overview.certificates.${
                    courseLevel ? courseLevel.toLowerCase() : 'no-certification'
                  }`,
                  {
                    count: profilesByLevel.get(courseLevel)?.length ?? 0,
                  },
                )}
                value={courseLevel ?? 'none'}
                data-testid={`tab-${courseLevel}`}
              />
            ))}
          </TabList>

          {levelsToShow.map(courseLevel => (
            <TabPanel
              value={courseLevel ?? 'none'}
              key={courseLevel}
              sx={{ p: 0, overflowX: 'auto' }}
              data-testid={`tab-panel-${courseLevel}`}
            >
              <IndividualsByLevelList orgId={orgId} courseLevel={courseLevel} />
            </TabPanel>
          ))}
        </TabContext>
      )}
    </>
  )
}
