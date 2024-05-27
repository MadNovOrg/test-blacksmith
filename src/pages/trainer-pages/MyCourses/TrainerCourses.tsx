import {
  Badge,
  Button,
  CircularProgress,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { CreateCourseMenu } from '@app/components/CreateCourseMenu'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import { useCourseDrafts } from '@app/hooks/useCourseDrafts'
import { CoursesFilters, useCourses } from '@app/hooks/useCourses'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { RoleName } from '@app/types'

import { ActionableCoursesTable } from './components/ActionableCoursesTable'
import { CoursesTable } from './components/CoursesTable'
import { FilterDrawer } from './components/FilterDrawer'
import { Filters } from './components/Filters'
import { TableMenu, Tables } from './components/TableMenu'
import useActionableCourses from './hooks/useActionableCourses'
import { getActionableStatuses } from './utils'

export type Props = {
  title?: string
  orgId?: string
  showAvailableCoursesButton?: boolean
}

type LocationStateType = {
  action: 'approved' | 'rejected' | 'deleted'
  course: {
    id: number
    code: string
  }
}

export const TrainerCourses: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  orgId,
  showAvailableCoursesButton,
}) => {
  const navigate = useNavigate()
  const { state: locationState, pathname } = useLocation()
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { addSnackbarMessage } = useSnackbar()

  const [selectedTab, setSelectedTab] = useState(0)

  const { activeRole, acl } = useAuth()
  const isTrainer = activeRole === RoleName.TRAINER

  const sorting = useTableSort('start', 'asc')
  const actionableSorting = useTableSort('start', 'asc', 'act-tbl')

  const actionableStatuses = useMemo(() => {
    if (activeRole) {
      return [...getActionableStatuses(activeRole)]
    }

    return []
  }, [activeRole])

  const { Pagination, perPage, currentPage } = useTablePagination({
    initialPerPage: 12,
    id: 'my-courses',
  })
  const {
    Pagination: ActionablePagination,
    perPage: actionablePerPage,
    currentPage: actionableCurrentPage,
  } = useTablePagination({ initialPerPage: 5, id: 'actionable-courses' })

  const [filters, setFilters] = useState<CoursesFilters | undefined>()

  const [
    { data: actionableCourses, fetching: fetchingActionableCourses },
    refetchActionableCourses,
  ] = useActionableCourses({
    statuses: actionableStatuses,
    sorting: actionableSorting,
    pagination: {
      perPage: actionablePerPage,
      currentPage: actionableCurrentPage,
    },
    orgId,
    filters,
  })

  const { total: totalDrafts } = useCourseDrafts({ sorting })

  const { courses, loading, mutate, total } = useCourses(
    activeRole ?? RoleName.USER,
    {
      sorting,
      filters,
      pagination: {
        perPage,
        currentPage,
      },
      orgId,
    }
  )

  const filtered = Boolean(
    Object.values(filters ?? {}).some(
      filter => (Array.isArray(filter) && filter.length) || Boolean(filter)
    )
  )

  useEffect(() => {
    if (locationState as LocationStateType) {
      const {
        action,
        course: { id, code },
      } = locationState

      addSnackbarMessage('course-approval-message', {
        label:
          action !== 'deleted' ? (
            <Trans
              i18nKey="pages.course-details.course-approval-message"
              components={{
                courseLink: <Link href={`/manage-courses/all/${id}/details`} />,
              }}
              values={{
                action,
                code,
              }}
            />
          ) : (
            <Trans
              i18nKey="pages.course-details.course-deleted-message"
              values={{
                code,
              }}
            />
          ),
      })

      window.history.replaceState(
        null,
        document.title,
        window.location.pathname
      )
    }
  }, [addSnackbarMessage, locationState])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const onAcceptedOrDeclined = useCallback(
    (
      course: { id: number },
      trainer: { type: Course_Trainer_Type_Enum },
      status: Course_Invite_Status_Enum
    ) => {
      const isAccepted = status === Course_Invite_Status_Enum.Accepted

      if (isAccepted) {
        switch (trainer.type) {
          case Course_Trainer_Type_Enum.Leader: {
            navigate(`./${course.id}/modules`)
            break
          }
          default: {
            navigate(`./${course.id}/details`)
            break
          }
        }
      } else {
        mutate()
        refetchActionableCourses({ requestPolicy: 'network-only' })
      }
    },
    [mutate, navigate, refetchActionableCourses]
  )

  const fetchingCourses = loading || fetchingActionableCourses

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5, position: 'relative' }}
      disableGutters={!isMobile}
    >
      <Helmet>
        <title>
          {pathname.includes('manage')
            ? t('pages.browser-tab-titles.manage-courses.title')
            : t('pages.browser-tab-titles.my-courses.title')}
        </title>
      </Helmet>
      <SnackbarMessage
        messageKey="course-created"
        sx={{ position: 'absolute' }}
      />

      <SnackbarMessage
        messageKey="course-approval-message"
        sx={{ position: 'absolute' }}
      />

      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
        <Box width={isMobile ? undefined : 250}>
          <Typography variant="h1">
            {title ?? t(isTrainer ? 'courses' : 'pages.my-courses.h1')}
          </Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {fetchingCourses ? <>&nbsp;</> : t('x-items', { count: total })}
          </Typography>

          {isMobile ? (
            <Box sx={{ mt: 2 }}>
              {acl.canCreateCourses() ? <CreateCourseMenu /> : null}
              <FilterDrawer setFilters={setFilters} />
              <TableMenu
                setSelectedTab={setSelectedTab}
                selectedTab={selectedTab}
              />
            </Box>
          ) : (
            <Stack gap={4} mt={4} width={'200px'}>
              <Filters onChange={setFilters} />
            </Stack>
          )}
        </Box>

        <Box flex={1}>
          <Box
            display="flex"
            alignItems="right"
            justifyContent="space-between"
            alignContent="right"
            mb={2}
          >
            <Box display="flex" gap={1}>
              {acl.isTrainer() && !isMobile ? (
                <Badge badgeContent={totalDrafts} color="warning">
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/drafts`)}
                  >
                    {t('pages.draft-courses.h1')}
                  </Button>
                </Badge>
              ) : null}
            </Box>
            <Box display="flex" gap={1}>
              {acl.canCreateCourses() && !isMobile ? (
                <CreateCourseMenu />
              ) : null}
              {showAvailableCoursesButton ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/organisations/${orgId}/courses`)}
                >
                  {t('pages.my-courses.find-available-courses')}
                </Button>
              ) : null}
            </Box>
          </Box>

          {fetchingCourses && !courses.length ? (
            <Stack direction="row" alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          ) : null}

          {(actionableCourses?.courses.length && !isMobile) ||
          (actionableCourses?.courses.length &&
            selectedTab === Tables.ACTIONABLE) ? (
            <Box mb={3} sx={{ overflowX: 'auto' }}>
              {/* <Typography variant="h6" mb={1}>
                {t('pages.my-courses.actionable-courses-title')}
              </Typography> */}
              <Box
                px={1}
                pb={1}
                bgcolor="grey.100"
                borderRadius={1}
                sx={{ overflowX: 'auto' }}
              >
                <ActionableCoursesTable
                  actionableCourses={actionableCourses}
                  fetchingActionableCourses={fetchingActionableCourses}
                  onAcceptedOrDeclined={onAcceptedOrDeclined}
                  sorting={actionableSorting}
                />
                {actionableCourses?.course_aggregate?.aggregate?.count ? (
                  <ActionablePagination
                    total={
                      actionableCourses?.course_aggregate?.aggregate?.count
                    }
                    rowsPerPage={[5, 10, 15, 20]}
                    testId="actionable-courses-pagination"
                  />
                ) : null}
              </Box>
            </Box>
          ) : null}

          {!isMobile || selectedTab === Tables.COURSES ? (
            <>
              {actionableCourses?.courses.length ? (
                <Typography variant="h6" mb={1}>
                  {t('pages.my-courses.courses-title')}
                </Typography>
              ) : null}
              <Box sx={{ overflowX: 'auto' }}>
                <CoursesTable
                  courses={courses}
                  isFiltered={filtered}
                  sorting={sorting}
                  loading={loading}
                  data-testid="courses-table"
                  hiddenColumns={new Set(['actions'])}
                />

                {total ? (
                  <Pagination testId="courses-pagination" total={total} />
                ) : null}
              </Box>
            </>
          ) : undefined}
        </Box>
      </Box>
    </Container>
  )
}
