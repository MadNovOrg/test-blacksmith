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
  Certificate_Status_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'
import useUpcomingCourses from '@app/modules/admin/hooks/useUpcomingCourses'
import { CourseForBookingTile } from '@app/modules/organisation/tabs/components/CourseForBookingTile'
import { OrgStatsTiles } from '@app/modules/organisation/tabs/components/OrgStatsTiles'
import { ALL_ORGS } from '@app/util'

import { useOrganisationProfilesByCertificateLevel } from '../hooks/useOrganisationProfielsByCertificateLevel/useOrganisationProfielsByCertificateLevel'

import { OrgIndividuals } from './components/OrgIndividuals'
import { OrgSummaryList } from './components/OrgSummaryList'

type OrgOverviewTabParams = {
  orgId: string
}

const UPCOMING_COURSES_LIMIT = 5

const LEVELS_IN_ORDER = [
  Course_Level_Enum.Advanced,
  Course_Level_Enum.AdvancedTrainer,
  Course_Level_Enum.BildAdvancedTrainer,
  Course_Level_Enum.BildIntermediateTrainer,
  Course_Level_Enum.BildRegular,
  Course_Level_Enum.IntermediateTrainer,
  Course_Level_Enum.Level_1,
  Course_Level_Enum.Level_1Bs,
  Course_Level_Enum.Level_1Np,
  Course_Level_Enum.Level_2,
  Course_Level_Enum.FoundationTrainer,
  Course_Level_Enum.FoundationTrainerPlus,
]

const statuses = Object.values(Certificate_Status_Enum)

export const OrgOverviewTab: React.FC<
  React.PropsWithChildren<OrgOverviewTabParams>
> = ({ orgId }) => {
  const [userByLevelSelectedTab, setUserByLevelSelectedTab] = useState<
    Course_Level_Enum | 'none'
  >()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()

  const isUKRegion = acl.isUK()

  const showAllOrgsButton = useMemo(() => {
    if (isUKRegion) return true
    if (!acl.isOrgAdmin()) return true
    return profile?.organizations.some(
      org => !org.organization.main_organisation,
    )
  }, [acl, isUKRegion, profile])

  const [certificateStatus, setCertificateStatus] = useQueryParam(
    'status',
    withDefault(
      createEnumArrayParam<Certificate_Status_Enum>(statuses),
      [] as Certificate_Status_Enum[],
    ),
  )

  const { profilesByLevel } = useOrganisationProfilesByCertificateLevel()

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

  useEffect(() => {
    setUserByLevelSelectedTab(levelsToShow[0])
  }, [levelsToShow])

  const onKPITileSelected = useCallback(
    (status: Certificate_Status_Enum | null) => {
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

  if (coursesLoading) {
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
          certificateStatus={certificateStatus}
          setUserByLevelSelectedTab={setUserByLevelSelectedTab}
          levelsToShow={levelsToShow}
          selectedTab={userByLevelSelectedTab as Course_Level_Enum}
        />

        {orgId === ALL_ORGS ? (
          <>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="h4">
                {t('pages.org-details.tabs.overview.organization-summary')}
              </Typography>
              {showAllOrgsButton ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/organisations/list')}
                  data-testid="see-all-organisations"
                >
                  {t('pages.org-details.tabs.overview.see-all-organizations')}
                </Button>
              ) : null}
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
