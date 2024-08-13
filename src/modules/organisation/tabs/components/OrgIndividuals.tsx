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
  CertificateStatus,
  CourseLevel,
  OrganizationProfile,
} from '@app/generated/graphql'

import { IndividualsByLevelList } from './IndividualsByLevelList'

type OrgIndividualsProps = {
  orgId: string
  profilesFetching: boolean
  certificateStatus: CertificateStatus[]
  profilesByLevel: Map<CourseLevel, OrganizationProfile[]>
  setUserByLevelSelectedTab: (value: CourseLevel | 'none') => void
  levelsToShow: CourseLevel[]
  selectedTab: CourseLevel | 'none'
  orgIdNotInProfiles?: boolean
}

export const OrgIndividuals: React.FC<OrgIndividualsProps> = ({
  orgId,
  profilesFetching,
  certificateStatus,
  profilesByLevel,
  setUserByLevelSelectedTab,
  levelsToShow,
  selectedTab,
  orgIdNotInProfiles,
}) => {
  const { t } = useTranslation()
  if (profilesFetching) {
    return (
      <Stack sx={{ alignItems: 'center' }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      {orgId !== 'all' && orgIdNotInProfiles ? (
        <>
          {certificateStatus.length && !profilesFetching ? (
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
              />
            ))}
          </TabList>

          {levelsToShow.map(courseLevel => (
            <TabPanel
              value={courseLevel ?? 'none'}
              key={courseLevel}
              sx={{ p: 0, overflowX: 'auto' }}
            >
              <IndividualsByLevelList
                profilesByLevel={profilesByLevel}
                orgId={orgId}
                courseLevel={courseLevel}
              />
            </TabPanel>
          ))}
        </TabContext>
      )}
    </>
  )
}
