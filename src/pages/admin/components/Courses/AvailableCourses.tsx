import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {
  Alert,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { differenceInDays } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { chain } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum, GetOrgCoursesQuery } from '@app/generated/graphql'
import useOrg from '@app/hooks/useOrg'
import useOrgCourses, { ALL_ORGS } from '@app/hooks/useOrgCourses'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { CourseForBookingTile } from '@app/pages/admin/components/Organizations/tabs/components/CourseForBookingTile'
import theme from '@app/theme'
import { geoDistance } from '@app/util/geo'

type CourseType = GetOrgCoursesQuery['courses'][0]

export const AvailableCourses: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { profile, acl } = useAuth()
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [filterType, setFilterType] = useState<Course_Type_Enum[]>([])
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [sortBy, setSortBy] =
    useState<keyof typeof sortFunctions>('date-ascending')

  const sortByDistance = sortBy === 'distance-to-org'

  const { data: orgs, loading: orgsLoading } = useOrg(
    ALL_ORGS,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const { Pagination, perPage, offset } = useTablePagination()
  const { coursesForBooking, loading: coursesLoading } = useOrgCourses(
    id ?? ALL_ORGS,
    profile?.id
  )

  const distances = useMemo(() => {
    return chain(coursesForBooking)
      .keyBy('id')
      .mapValues(c =>
        geoDistance(
          orgs?.find(org => org.id === id)?.geoCoordinates,
          c.schedules[0].venue?.geoCoordinates
        )
      )
      .value()
  }, [coursesForBooking, id, orgs])

  const sortFunctions = useMemo(() => {
    return {
      'date-ascending': (a: CourseType, b: CourseType) => {
        if (a.schedules[0].start < b.schedules[0].start) return -1
        if (a.schedules[0].start > b.schedules[0].start) return 1
        return 0
      },
      'date-descending': (a: CourseType, b: CourseType) => {
        if (a.schedules[0].start < b.schedules[0].start) return 1
        if (a.schedules[0].start > b.schedules[0].start) return -1
        return 0
      },
      'distance-to-org': (a: CourseType, b: CourseType) => {
        if (!distances) return 0
        const aDistance = distances[a.id]
        const bDistance = distances[b.id]
        if (aDistance === null) return 1
        if (bDistance === null) return -1
        if (aDistance < bDistance) return -1
        if (aDistance > bDistance) return 1
        return 0
      },
    }
  }, [distances])

  const courses = useMemo(() => {
    const values = coursesForBooking.filter(c => {
      const start = new Date(c.schedules[0].start)
      if (dateFrom && start < dateFrom && differenceInDays(start, dateFrom) > 0)
        return false
      if (dateTo && start > dateTo && differenceInDays(start, dateTo) > 0)
        return false
      return filterType.length > 0 ? filterType.some(t => t === c.type) : true
    })
    if (sortByDistance) {
      const knownDistances = values.filter(c => !!distances[c.id])
      const online = values.filter(c => !c.schedules[0].venue)
      const unknown = values.filter(
        c => c.schedules[0].venue && !distances[c.id]
      )
      return [
        ...knownDistances.sort(sortFunctions[sortBy]),
        ...online,
        ...unknown,
      ]
    }
    return values.sort(sortFunctions[sortBy])
  }, [
    coursesForBooking,
    sortByDistance,
    sortFunctions,
    sortBy,
    dateFrom,
    dateTo,
    filterType,
    distances,
  ])

  const currentPageRecords = useMemo(() => {
    return courses?.slice(offset, offset + perPage)
  }, [courses, offset, perPage])

  if (coursesLoading || orgsLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="courses-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
      <FullHeightPage bgcolor={theme.palette.grey[100]} pb={3}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Box display="flex" gap={4}>
            <Box width={250}>
              <Typography variant="h1">
                {t('pages.available-courses.title')}
              </Typography>

              <Stack gap={4} mt={4}>
                <FilterSearch value={keyword} onChange={setKeyword} />

                <Box>
                  <Stack gap={1}>
                    <FilterCourseType onChange={setFilterType} />

                    <TextField
                      select
                      variant="standard"
                      value={id}
                      label={t('common.organization')}
                      error={id === ALL_ORGS && sortByDistance}
                      helperText={t(
                        'pages.available-courses.select-organization'
                      )}
                      onChange={event =>
                        navigate(`/organizations/${event.target.value}/courses`)
                      }
                    >
                      <MenuItem value={ALL_ORGS}>
                        {t('common.all-organizations')}
                      </MenuItem>
                      {orgs?.map(org => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <DatePicker
                      clearable
                      clearText={t('common.clear')}
                      value={dateFrom}
                      onChange={setDateFrom}
                      renderInput={params => (
                        <TextField
                          {...params}
                          data-testid="DateFrom"
                          label={t('common.from')}
                          variant="standard"
                          fullWidth
                        />
                      )}
                    />

                    <DatePicker
                      clearable
                      clearText={t('common.clear')}
                      value={dateTo}
                      onChange={setDateTo}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={t('common.to')}
                          variant="standard"
                          fullWidth
                        />
                      )}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Box flex={1}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                mb={2}
              >
                <TextField
                  select
                  variant="standard"
                  value={sortBy}
                  onChange={event =>
                    setSortBy(event.target.value as keyof typeof sortFunctions)
                  }
                  sx={{ minWidth: 130 }}
                >
                  {Object.keys(sortFunctions).map(mode => (
                    <MenuItem key={mode} value={mode}>
                      {t(`pages.available-courses.sorting.${mode}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {sortBy === 'distance-to-org' && id === ALL_ORGS ? (
                <Alert variant="outlined" color="warning" severity="warning">
                  {t('pages.available-courses.please-select-organization')}
                </Alert>
              ) : null}

              {currentPageRecords?.map(course => (
                <CourseForBookingTile
                  course={course}
                  key={course.id}
                  showDistance={sortByDistance}
                  distance={distances[course.id]}
                  variant="row"
                />
              ))}

              {courses ? <Pagination total={courses.length} /> : null}
            </Box>
          </Box>
        </Container>
      </FullHeightPage>
    </LocalizationProvider>
  )
}
