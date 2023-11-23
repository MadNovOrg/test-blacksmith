import { Container, Stack, useTheme, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { CoursesTable } from '@app/pages/user-pages/MyCourses/Components/CoursesTable'
import { LoadingStatus } from '@app/util'

import { FilterDrawer } from './Components/FilterDrawer'
import { Filters } from './Components/Filters'
import { useUserCourses, CoursesFilters } from './hooks/useUserCourses'

type ManageContactRoleCoursesProps = {
  isOrgKeyContact?: boolean
}

export const ManageContactRoleCourses: React.FC<
  React.PropsWithChildren<ManageContactRoleCoursesProps>
> = ({ isOrgKeyContact }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [filters, setFilters] = useState<CoursesFilters | undefined>()

  const sorting = useTableSort('start', 'desc')
  const { Pagination, perPage, currentPage } = useTablePagination()

  const {
    courses = [],
    status,
    total,
  } = useUserCourses(
    filters,
    sorting,
    {
      perPage,
      currentPage,
    },
    undefined,
    !isOrgKeyContact,
    isOrgKeyContact
  )

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
          <Typography variant="h1">{t('courses')}</Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {loading ? <>&nbsp;</> : t('x-items', { count: total })}
          </Typography>

          {isMobile ? (
            <Box sx={{ mt: 2 }}>
              <FilterDrawer setFilters={setFilters} />
            </Box>
          ) : (
            <Stack gap={4} mt={4}>
              <Filters onChange={setFilters} forManaging />
            </Stack>
          )}
        </Box>

        <CoursesTable
          additionalColumns={
            isOrgKeyContact ? new Set(['type', 'registrants']) : undefined
          }
          courses={courses}
          sorting={sorting}
          loading={loading}
          filtered={filtered}
          paginationComponent={total ? <Pagination total={total} /> : null}
          isManaging
        />
      </Box>
    </Container>
  )
}
