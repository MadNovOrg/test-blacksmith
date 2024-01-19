import {
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enLocale from 'date-fns/locale/en-GB'
import { isNumber, orderBy } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'

import { FilterByCourseDeliveryType } from '@app/components/filters/FilterByCourseDeliveryType'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterSearch } from '@app/components/FilterSearch'
import { RequestAQuoteBanner } from '@app/components/RequestAQuoteBanner'
import { useAuth } from '@app/context/auth'
import {
  Course_Bool_Exp,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  GetUpcomingCoursesQuery,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import useUpcomingCourses from '@app/hooks/useUpcomingCourses'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgSelectionToolbar } from '@app/modules/organisation/components/OrgSelectionToolbar/OrgSelectionToolbar'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { CourseForBookingTile } from '@app/modules/organisation/tabs/components/CourseForBookingTile'
import { ALL_ORGS } from '@app/util'
import { geoDistance } from '@app/util/geo'

type UpcomingCourse = GetUpcomingCoursesQuery['courses'][0]

export const AvailableCourses: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation()
  const { id } = useParams()
  const { profile, acl } = useAuth()
  const [searchParams] = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [filterDeliveryType, setFilterDeliveryType] = useState<
    Course_Delivery_Type_Enum[]
  >([])
  const [filterByCertificateLevel, setFilteredByCertificateLevel] = useState<
    Course_Level_Enum[]
  >([])
  const [sortMode, setSortMode] = useState(
    id !== ALL_ORGS ? 'distance-to-org' : 'date-ascending'
  )

  const sortingByDistance = sortMode === 'distance-to-org'

  const { data: orgs, fetching: orgsLoading } = useOrgV2({
    orgId: ALL_ORGS,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
  })

  const { Pagination, perPage, offset } = useTablePagination()
  const filters = useMemo(() => {
    const conditions: Course_Bool_Exp[] = [
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
    ]
    if (dateFrom) {
      conditions.push({ start: { _gte: dateFrom } })
    }
    if (dateTo) {
      conditions.push({ start: { _lte: dateTo } })
    }
    if (filterByCertificateLevel.length) {
      conditions.push({ level: { _in: filterByCertificateLevel } })
    }
    if (filterDeliveryType.length) {
      conditions.push({ deliveryType: { _in: filterDeliveryType } })
    }
    if (keyword) {
      conditions.push({
        _or: [
          {
            schedule: { venue: { name: { _ilike: `%${keyword}%` } } },
          },
          {
            schedule: { venue: { city: { _ilike: `%${keyword}%` } } },
          },
          {
            schedule: { venue: { addressLineOne: { _ilike: `%${keyword}%` } } },
          },
          {
            schedule: { venue: { addressLineTwo: { _ilike: `%${keyword}%` } } },
          },
          {
            schedule: { venue: { country: { _ilike: `%${keyword}%` } } },
          },
          {
            schedule: { venue: { postCode: { _ilike: `%${keyword}%` } } },
          },
          {
            course_code: { _ilike: `%${keyword}%` },
          },
        ],
      })
    }
    return { _and: conditions }
  }, [dateFrom, dateTo, keyword, filterDeliveryType, filterByCertificateLevel])

  const { courses: coursesForBooking, loading: coursesLoading } =
    useUpcomingCourses(profile?.id, filters)

  const distances = useMemo(() => {
    const result = new Map<number, number | null>()
    if (coursesForBooking) {
      coursesForBooking.forEach(course => {
        result.set(
          course.id,
          geoDistance(
            orgs?.orgs.find(org => org.id === id)?.geoCoordinates,
            course.schedules[0].venue?.geoCoordinates
          )
        )
      })
    }
    return result
  }, [coursesForBooking, id, orgs])

  const sortByDistance = useCallback(
    (a: UpcomingCourse, b: UpcomingCourse) => {
      if (!distances) return 0
      const aDistance = distances.get(a.id)
      const bDistance = distances.get(b.id)
      if (!isNumber(aDistance) && !aDistance) return 1
      if (!isNumber(bDistance) && !bDistance) return -1
      if (aDistance < bDistance) return -1
      if (aDistance > bDistance) return 1
      return 0
    },
    [distances]
  )

  const sortModes = useMemo(() => {
    const modes = ['date-ascending', 'date-descending']
    if (id !== ALL_ORGS) {
      modes.unshift('distance-to-org')
    }
    return modes
  }, [id])

  useEffect(() => {
    if (!sortModes.includes(sortMode)) {
      setSortMode('date-ascending')
    }
  }, [sortMode, sortModes])

  const courses = useMemo(() => {
    if (coursesForBooking && sortingByDistance) {
      const knownDistances = coursesForBooking.filter(
        c => !!distances.get(c.id)
      )
      const online = coursesForBooking.filter(c => !c.schedules[0].venue)
      const unknown = coursesForBooking.filter(
        c => c.schedules[0].venue && !distances.get(c.id)
      )
      return [...knownDistances.sort(sortByDistance), ...online, ...unknown]
    }
    return orderBy(
      coursesForBooking,
      'start',
      sortMode === 'date-ascending' ? 'asc' : 'desc'
    )
  }, [
    sortingByDistance,
    coursesForBooking,
    sortMode,
    sortByDistance,
    distances,
  ])

  const currentPageRecords = useMemo(() => {
    return courses?.slice(offset, offset + perPage)
  }, [courses, offset, perPage])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Helmet>
        <title>{t('pages.browser-tab-titles.book-a-course.title')}</title>
      </Helmet>
      <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
        {orgs && orgs.orgs.length > 1 ? (
          <OrgSelectionToolbar prefix="/organisations" postfix="/courses" />
        ) : null}
        {coursesLoading || orgsLoading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="courses-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Container maxWidth="lg" sx={{ py: 5 }} disableGutters={isMobile}>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              gap={3}
            >
              <Box width={isMobile ? undefined : 250} px={isMobile ? 2 : 0}>
                <Typography variant="h1">
                  {t('pages.available-courses.title')}
                </Typography>

                <Stack gap={4} mt={4}>
                  <FilterSearch value={keyword} onChange={setKeyword} />

                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {t('pages.available-courses.date-filter')}
                    </Typography>

                    <Stack gap={1}>
                      <DatePicker
                        value={dateFrom}
                        onChange={setDateFrom}
                        slotProps={{
                          textField: {
                            label: t('common.from'),
                            variant: 'standard',
                            fullWidth: true,
                          },
                        }}
                      />

                      <DatePicker
                        value={dateTo}
                        onChange={setDateTo}
                        slotProps={{
                          textField: {
                            label: t('common.to'),
                            variant: 'standard',
                            fullWidth: true,
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {t('filter-by')}
                    </Typography>

                    <Stack gap={1}>
                      <FilterByCourseLevel
                        title={t('course-level')}
                        onChange={setFilteredByCertificateLevel}
                      />
                      <FilterByCourseDeliveryType
                        onChange={setFilterDeliveryType}
                      />
                    </Stack>
                  </Box>
                  <RequestAQuoteBanner />
                </Stack>
              </Box>

              <Box flex={1} px={isMobile ? 2 : 0}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  mb={2}
                >
                  <TextField
                    select
                    variant="filled"
                    value={sortMode}
                    onChange={event => setSortMode(event.target.value)}
                    sx={{ minWidth: 130 }}
                  >
                    {sortModes.map(mode => (
                      <MenuItem key={mode} value={mode}>
                        {t(`pages.available-courses.sorting.${mode}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {courses.length > 0 ? (
                  <>
                    {currentPageRecords?.map(course => (
                      <CourseForBookingTile
                        course={course}
                        key={course.id}
                        showDistance={sortingByDistance}
                        distance={distances.get(course.id)}
                        variant="row"
                      />
                    ))}
                    <Pagination total={courses.length} />{' '}
                  </>
                ) : (
                  <Typography variant="body2">
                    {t('pages.available-courses.no-results')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Container>
        )}
      </FullHeightPageLayout>
    </LocalizationProvider>
  )
}
