import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Link,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { Course_Status_Enum, Course_Type_Enum } from '@app/generated/graphql'
import useOrg from '@app/hooks/useOrg'
import useOrgCourses from '@app/hooks/useOrgCourses'
import { CourseForBookingTile } from '@app/pages/admin/components/Organizations/tabs/components/CourseForBookingTile'
import { IndividualsByLevelList } from '@app/pages/admin/components/Organizations/tabs/components/IndividualsByLevelList'
import { OrgStatsTiles } from '@app/pages/admin/components/Organizations/tabs/components/OrgStatsTiles'
import { OrgSummaryList } from '@app/pages/admin/components/Organizations/tabs/components/OrgSummaryList'
import { CourseLevel } from '@app/types'

type OrgOverviewTabParams = {
  orgId: string
}

const LEVELS_IN_ORDER = [
  CourseLevel.Level_1,
  CourseLevel.Level_2,
  CourseLevel.IntermediateTrainer,
  CourseLevel.Advanced,
  CourseLevel.AdvancedTrainer,
  null,
]

export const OrgOverviewTab: React.FC<OrgOverviewTabParams> = ({ orgId }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const [userByLevelSelectedTab, setUserByLevelSelectedTab] = useState<string>()

  const {
    stats,
    profilesByLevel,
    loading: orgLoading,
  } = useOrg(orgId, profile?.id, acl.canViewAllOrganizations())
  const { coursesForBooking, loading: coursesLoading } = useOrgCourses(
    orgId,
    profile?.id,
    acl.isTTAdmin(),
    {
      _and: [
        { type: { _eq: Course_Type_Enum.Open } },
        { status: { _neq: Course_Status_Enum.Cancelled } },
      ],
    }
  )

  const defaultTab =
    LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level))[0] ?? 'none'

  useEffect(() => {
    if (userByLevelSelectedTab === undefined) {
      setUserByLevelSelectedTab(defaultTab)
    }
  }, [userByLevelSelectedTab, defaultTab, orgId, profilesByLevel])

  let selectedTab = defaultTab
  if (userByLevelSelectedTab) {
    const value =
      userByLevelSelectedTab === 'none'
        ? null
        : (userByLevelSelectedTab as CourseLevel)
    selectedTab = profilesByLevel.get(value)
      ? userByLevelSelectedTab
      : defaultTab
  }

  if (orgLoading || coursesLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="org-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <OrgStatsTiles orgId={orgId} />
      </Grid>

      <Grid item xs={12} md={9} p={1} mt={2}>
        <Typography variant="h4">
          {t('pages.org-details.tabs.overview.individuals-by-training-level')}
        </Typography>

        {!stats[orgId]?.profiles.count ? (
          <Alert sx={{ mt: 2 }} severity="info">
            {t('pages.org-details.tabs.overview.no-org-users') + ' '}
            <Link href={'/invite'}>
              {t('pages.org-details.tabs.overview.click-here-to-invite')}
            </Link>
          </Alert>
        ) : (
          <TabContext value={selectedTab}>
            <TabList
              onChange={(_, value) => setUserByLevelSelectedTab(value)}
              sx={{ mt: 2 }}
            >
              {LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level)).map(
                courseLevel => (
                  <Tab
                    key={courseLevel}
                    label={t(
                      `pages.org-details.tabs.overview.certificates.${
                        courseLevel
                          ? courseLevel.toLowerCase()
                          : 'no-certification'
                      }`,
                      { count: profilesByLevel.get(courseLevel)?.length ?? 0 }
                    )}
                    value={courseLevel ?? 'none'}
                  />
                )
              )}
            </TabList>

            {LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level)).map(
              courseLevel => (
                <TabPanel
                  value={courseLevel ?? 'none'}
                  key={courseLevel}
                  sx={{ p: 0 }}
                >
                  <IndividualsByLevelList
                    orgId={orgId}
                    courseLevel={courseLevel}
                  />
                </TabPanel>
              )
            )}
          </TabContext>
        )}

        <Box display="flex" justifyContent="space-between" my={2}>
          <Typography variant="h4">
            {t('pages.org-details.tabs.overview.organization-summary')}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/organisations/list')}
          >
            {t('pages.org-details.tabs.overview.see-all-organizations')}
          </Button>
        </Box>

        <OrgSummaryList orgId={orgId} />
      </Grid>

      <Grid item xs={12} md={3} p={1} mt={2}>
        <Typography variant="h4">
          {t('pages.org-details.tabs.overview.available-courses-for-booking')}
        </Typography>

        {coursesForBooking?.map(course => (
          <CourseForBookingTile course={course} key={course.id} />
        ))}

        <Button
          variant="outlined"
          onClick={() => navigate('courses')}
          sx={{ mt: 2 }}
        >
          {t('pages.org-details.tabs.overview.see-all-courses')}
        </Button>
      </Grid>
    </Grid>
  )
}
