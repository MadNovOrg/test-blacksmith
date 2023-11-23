import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  Grid,
  Link,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { RequestAQuoteBanner } from '@app/components/RequestAQuoteBanner'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  Course_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'
import useUpcomingCourses from '@app/hooks/useUpcomingCourses'
import { CourseForBookingTile } from '@app/pages/admin/components/Organizations/tabs/components/CourseForBookingTile'
import { IndividualsByLevelList } from '@app/pages/admin/components/Organizations/tabs/components/IndividualsByLevelList'
import { OrgStatsTiles } from '@app/pages/admin/components/Organizations/tabs/components/OrgStatsTiles'
import { OrgSummaryList } from '@app/pages/admin/components/Organizations/tabs/components/OrgSummaryList'
import { CertificateStatus } from '@app/types'

type OrgOverviewTabParams = {
  orgId: string
}

const LEVELS_IN_ORDER = [
  Course_Level_Enum.Level_1,
  Course_Level_Enum.Level_2,
  Course_Level_Enum.ThreeDaySafetyResponseTrainer,
  Course_Level_Enum.IntermediateTrainer,
  Course_Level_Enum.Advanced,
  Course_Level_Enum.AdvancedTrainer,
  Course_Level_Enum.BildAdvancedTrainer,
  Course_Level_Enum.BildIntermediateTrainer,
  Course_Level_Enum.BildRegular,
  null,
]

export const OrgOverviewTab: React.FC<
  React.PropsWithChildren<OrgOverviewTabParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const [userByLevelSelectedTab, setUserByLevelSelectedTab] = useState<string>()

  const statuses = Object.values(CertificateStatus) as CertificateStatus[]
  const [certificateStatus, setCertificateStatus] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<CertificateStatus>(statuses),
      [] as CertificateStatus[]
    )
  )

  const {
    stats,
    profilesByLevel,
    loading: orgLoading,
  } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations(),
    certificateStatus
  )
  const { courses: coursesForBooking, loading: coursesLoading } =
    useUpcomingCourses(profile?.id, {
      _and: [
        { type: { _eq: Course_Type_Enum.Open } },
        { displayOnWebsite: { _eq: true } },
        {
          status: {
            _nin: [
              Course_Status_Enum.Cancelled,
              Course_Status_Enum.Completed,
              Course_Status_Enum.Declined,
              Course_Status_Enum.EvaluationMissing,
              Course_Status_Enum.GradeMissing,
              Course_Status_Enum.Draft,
            ],
          },
        },
      ],
    })

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
        : (userByLevelSelectedTab as Course_Level_Enum)
    selectedTab = profilesByLevel.get(value)
      ? userByLevelSelectedTab
      : defaultTab
  }

  const onKPITileSelected = useCallback(
    (status: CertificateStatus | null) => {
      if (status) {
        setCertificateStatus(currentStatuses => {
          if (currentStatuses && currentStatuses.includes(status)) {
            return currentStatuses.filter(s => s !== status)
          } else {
            return [...(currentStatuses ?? []), status]
          }
        })
      } else {
        setCertificateStatus([])
      }
    },
    [setCertificateStatus]
  )

  if ((orgLoading || coursesLoading) && !stats) {
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
        <OrgStatsTiles
          orgId={orgId}
          selected={certificateStatus}
          onTileSelect={onKPITileSelected}
        />
      </Grid>

      <Grid item xs={12} md={9} p={1} mt={2}>
        <Typography variant="h4" mt={3}>
          {t('pages.org-details.tabs.overview.individuals-by-training-level')}
        </Typography>

        {!stats[orgId]?.profiles.count && !orgLoading ? (
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
                  sx={{ p: 0, overflowX: 'auto' }}
                >
                  <IndividualsByLevelList
                    orgId={orgId}
                    courseLevel={courseLevel}
                    certificateStatus={certificateStatus}
                  />
                </TabPanel>
              )
            )}
          </TabContext>
        )}

        {orgId === ALL_ORGS ? (
          <>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="h4">
                {t('pages.org-details.tabs.overview.organization-summary')}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/organisations/list')}
                data-testid="see-all-organisations"
              >
                {t('pages.org-details.tabs.overview.see-all-organizations')}
              </Button>
            </Box>

            <OrgSummaryList orgId={orgId} />
          </>
        ) : null}
      </Grid>

      <Grid item xs={12} md={3} p={1} mt={2}>
        <Typography variant="h4">
          {t('pages.org-details.tabs.overview.available-courses-for-booking')}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('courses')}
          sx={{ mt: 2 }}
        >
          {t('pages.org-details.tabs.overview.see-all-courses')}
        </Button>
        {coursesForBooking?.map(course => (
          <CourseForBookingTile course={course} key={course.id} />
        ))}
        <RequestAQuoteBanner sx={{ mt: 2 }} />
      </Grid>
    </Grid>
  )
}
