import {
  CircularProgress,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AttendeeCourseStatus } from '@app/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { TrainerAvatarGroup } from '@app/components/TrainerAvatarGroup'
import { Course_Status_Enum } from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { LoadingStatus } from '@app/util'

import { FilterDrawer } from './Components/FilterDrawer'
import { Filters } from './Components/Filters'
import { useUserCourses, CoursesFilters } from './hooks/useUserCourses'

export const AttendeeCourses: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [filters, setFilters] = useState<CoursesFilters | undefined>()

  const sorting = useTableSort('start', 'desc')
  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'venue', label: t('pages.my-courses.col-venue'), sorting: false },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      {
        id: 'createdAt',
        label: t('pages.my-courses.col-created'),
        sorting: true,
      },
      {
        id: 'trainers',
        label: t('pages.my-courses.col-trainers'),
        sorting: false,
      },
      { id: 'status', label: t('pages.my-courses.col-status'), sorting: false },
    ],
    [t]
  )

  const { Pagination, perPage, currentPage } = useTablePagination()

  const {
    courses = [],
    status,
    total,
  } = useUserCourses(filters, sorting, {
    perPage,
    currentPage,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const loading = status === LoadingStatus.FETCHING

  const isDateEmpty = Object.values(filters?.creation || {}).every(
    x => x === undefined || x === null
  )

  const filtered = Boolean(
    filters?.keyword ||
      filters?.statuses?.length ||
      filters?.levels?.length ||
      !isDateEmpty
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5, px: 0 }} disableGutters={!isMobile}>
      <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={4}>
        <Box width={isMobile ? undefined : 250}>
          <Typography variant="h1">{t('my-courses')}</Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count: courses.length })}
          </Typography>

          {isMobile ? (
            <Box sx={{ mt: 2 }}>
              <FilterDrawer setFilters={setFilters} />
            </Box>
          ) : (
            <Stack gap={4} mt={4}>
              <Filters onChange={setFilters} />
            </Stack>
          )}
        </Box>

        <Box flex={1} sx={{ overflowX: 'auto' }}>
          <Table data-testid="courses-table">
            <TableHead
              cols={cols}
              order={sorting.dir}
              orderBy={sorting.by}
              onRequestSort={sorting.onSort}
            />
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={cols.length} align="center">
                    <CircularProgress data-testid="fetching-courses" />
                  </TableCell>
                </TableRow>
              )}

              <TableNoRows
                noRecords={!loading && !courses.length}
                filtered={filtered}
                colSpan={cols.length}
                itemsName={t('courses').toLowerCase()}
              />

              {courses?.map((c, index) => {
                const nameCell = (
                  <>
                    <Typography mb={1}>{c.name}</Typography>
                    <Typography variant="body2" data-testid="course-code">
                      {c.course_code}
                    </Typography>
                  </>
                )

                return (
                  <TableRow
                    key={c.id}
                    className="MyCoursesRow"
                    data-testid={`course-row-${c.id}`}
                    data-index={index}
                  >
                    <TableCell>
                      {c.status !== Course_Status_Enum.Cancelled ? (
                        <Link href={`${c.id}/details`}>{nameCell}</Link>
                      ) : (
                        nameCell
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography mb={1}>
                        {c.schedule[0].venue?.name}
                      </Typography>
                      <Typography variant="body2">
                        {c.schedule[0].virtualLink
                          ? 'Online'
                          : c.schedule[0].venue?.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {c.dates?.aggregate?.start?.date && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {t('dates.defaultShort', {
                              date: c.dates.aggregate.start.date,
                            })}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="grey.600"
                            whiteSpace="nowrap"
                          >
                            {t('dates.time', {
                              date: c.dates.aggregate.start.date,
                            })}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.dates?.aggregate?.end?.date && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {t('dates.defaultShort', {
                              date: c.dates.aggregate.end.date,
                            })}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="grey.600"
                            whiteSpace="nowrap"
                          >
                            {t('dates.time', {
                              date: c.dates.aggregate.end.date,
                            })}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.createdAt && (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {t('dates.defaultShort', {
                              date: c.createdAt,
                            })}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="grey.600"
                            whiteSpace="nowrap"
                          >
                            {t('dates.time', {
                              date: c.createdAt,
                            })}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <TrainerAvatarGroup
                        trainers={c.trainers ?? []}
                        courseId={c.id}
                      />
                    </TableCell>
                    <TableCell>
                      <AttendeeCourseStatus course={c} />
                    </TableCell>
                  </TableRow>
                )
              }) ?? null}
            </TableBody>
          </Table>

          {total ? <Pagination total={total} /> : null}
        </Box>
      </Box>
    </Container>
  )
}
