import { Button, CircularProgress, Container, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseType } from '@app/components/FilterCourseType'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { useCourses } from '@app/hooks/useCourses'
import { useTableSort } from '@app/hooks/useTableSort'
import { RoleName } from '@app/types'

export const MyCourses: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { profile } = useAuth()

  const sorting = useTableSort('name', 'asc')
  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.my-courses.col-name'), sorting: true },
      { id: 'type', label: t('pages.my-courses.col-type'), sorting: true },
      { id: 'start', label: t('pages.my-courses.col-start'), sorting: true },
      { id: 'end', label: t('pages.my-courses.col-end'), sorting: true },
      { id: 'empty', label: '' },
    ],
    [t]
  )

  const [keyword, setKeyword] = useState('')
  const [filterLevel, setFilterLevel] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string[]>([])

  const [where, filtered] = useMemo(() => {
    let isFiltered = false

    const obj: Record<string, object> = {
      participants: { profile_id: { _eq: profile?.id } },
    }

    if (filterLevel.length) {
      obj.level = { _in: filterLevel }
      isFiltered = true
    }

    if (filterType.length) {
      obj.type = { _in: filterType }
      isFiltered = true
    }

    const query = keyword.trim()
    if (query.length) {
      obj.name = { _ilike: `%${query}%` }
      isFiltered = true
    }

    return [obj, isFiltered]
  }, [filterLevel, filterType, keyword, profile?.id])

  const { courses, loading } = useCourses(RoleName.USER, { sorting, where })
  const count = courses.length

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography variant="h1">{t('my-courses')}</Typography>
          <Typography variant="body2" color="grey.500" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count })}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch value={keyword} onChange={setKeyword} />

            <Box>
              <Typography variant="body2" fontWeight="bold">
                {t('filter-by')}
              </Typography>

              <Stack gap={1}>
                <FilterCourseLevel onChange={setFilterLevel} />
                <FilterCourseType onChange={setFilterType} />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box flex={1}>
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
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              <TableNoRows
                noRecords={!loading && !count}
                filtered={filtered}
                colSpan={cols.length}
                itemsName={t('courses').toLowerCase()}
              />

              {courses.map(c => (
                <TableRow
                  key={c.id}
                  className="MyCoursesRow"
                  data-testid={`course-row-${c.id}`}
                >
                  <TableCell>
                    <Link href={`${c.id}/details`}>
                      <Typography>{t(`course-levels.${c.level}`)}</Typography>
                      <Typography variant="body2">{c.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{t(`course-types.${c.type}`)}</TableCell>
                  <TableCell>
                    {c.dates.aggregate.start.date && (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {t('dates.short', {
                            date: c.dates.aggregate.start.date,
                          })}
                        </Typography>
                        <Typography variant="body2" color="grey.500">
                          {t('dates.time', {
                            date: c.dates.aggregate.start.date,
                          })}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.dates.aggregate.end.date && (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {t('dates.short', {
                            date: c.dates.aggregate.end.date,
                          })}
                        </Typography>
                        <Typography variant="body2" color="grey.500">
                          {t('dates.time', {
                            date: c.dates.aggregate.end.date,
                          })}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`${c.id}/details`)}
                    >
                      {t('view')}
                    </Button>
                  </TableCell>
                </TableRow>
              )) ?? null}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Container>
  )
}
