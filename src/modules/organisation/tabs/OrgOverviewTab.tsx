import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  CertificateStatus,
  Course_Status_Enum,
  Course_Type_Enum,
  CourseLevel,
  OrganizationProfile,
} from '@app/generated/graphql'
import useUpcomingCourses from '@app/modules/admin/hooks/useUpcomingCourses'
import { useOrganisationProfiles } from '@app/modules/organisation/hooks/useOrganisationProfiles'
import { CourseForBookingTile } from '@app/modules/organisation/tabs/components/CourseForBookingTile'
import { OrgStatsTiles } from '@app/modules/organisation/tabs/components/OrgStatsTiles'
import { ALL_ORGS } from '@app/util'

import { OrgIndividuals } from './components/OrgIndividuals'
import { OrgSummaryList } from './components/OrgSummaryList'

type OrgOverviewTabParams = {
  orgId: string
}

const UPCOMING_COURSES_LIMIT = 5

const LEVELS_IN_ORDER = [
  CourseLevel.Advanced,
  CourseLevel.AdvancedTrainer,
  CourseLevel.BildAdvancedTrainer,
  CourseLevel.BildIntermediateTrainer,
  CourseLevel.BildRegular,
  CourseLevel.IntermediateTrainer,
  CourseLevel.Level_1,
  CourseLevel.Level_1Bs,
  CourseLevel.Level_2,
  CourseLevel.FoundationTrainerPlus,
]

const statuses = Object.values(CertificateStatus) as CertificateStatus[]

export const OrgOverviewTab: React.FC<
  React.PropsWithChildren<OrgOverviewTabParams>
> = ({ orgId }) => {
  const [userByLevelSelectedTab, setUserByLevelSelectedTab] = useState<
    CourseLevel | 'none'
  >()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()

  const [certificateStatus, setCertificateStatus] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<CertificateStatus>(statuses),
      [] as CertificateStatus[],
    ),
  )

  const {
    profilesByLevel,
    profilesByOrganisation,
    fetching: profilesFetching,
  } = useOrganisationProfiles({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    withUpcomingEnrollmentsOnly: true,
    pause: orgId === 'all',
  })

  const { courses: coursesForBooking, fetching: coursesLoading } =
    useUpcomingCourses(
      profile?.id,
      {
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
      },
      UPCOMING_COURSES_LIMIT,
    )

  const levelsToShow = useMemo(() => {
    return LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level))
  }, [profilesByLevel])

  const defaultTab = levelsToShow[0] ?? 'none'

  useEffect(() => {
    if (userByLevelSelectedTab === undefined) {
      setUserByLevelSelectedTab(defaultTab)
    }
  }, [userByLevelSelectedTab, defaultTab, orgId, profilesByLevel])

  let selectedTab: CourseLevel | 'none' = defaultTab
  if (userByLevelSelectedTab) {
    const value =
      userByLevelSelectedTab === 'none' ? null : userByLevelSelectedTab
    selectedTab = profilesByLevel.get(value as CourseLevel)
      ? userByLevelSelectedTab
      : defaultTab
  }

  const onKPITileSelected = useCallback(
    (status: CertificateStatus | null) => {
      if (status) {
        setCertificateStatus(currentStatuses => {
          if (currentStatuses?.includes(status)) {
            return currentStatuses.filter(s => s !== status)
          } else {
            return [...(currentStatuses ?? []), status]
          }
        })
      } else {
        setCertificateStatus([])
      }
    },
    [setCertificateStatus],
  )

  const shouldShowLoader = coursesLoading

  if (shouldShowLoader) {
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

        <OrgIndividuals
          orgId={orgId}
          profilesFetching={profilesFetching}
          certificateStatus={certificateStatus}
          profilesByLevel={
            profilesByLevel as Map<CourseLevel, OrganizationProfile[]>
          }
          setUserByLevelSelectedTab={setUserByLevelSelectedTab}
          levelsToShow={levelsToShow}
          selectedTab={selectedTab}
          orgIdNotInProfiles={!profilesByOrganisation.get(orgId)?.length}
        />

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
          data-testId="see-all-courses"
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
