import { Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { noop } from 'ts-essentials'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import { CourseDetailsFilters } from '@app/modules/course/components/CourseForm/CourseDetailsFilters'
import useCourseParticipants from '@app/modules/course_details/hooks/course-participant/useCourseParticipants'
import { Grade } from '@app/modules/grading/components/Grade'
import { LinkToProfile } from '@app/modules/profile/components/LinkToProfile'
import { Course, SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

import { GradingDetailsAlert } from '../../components/GradingDetailsAlert/GradingDetailsAlert'

type CourseGradingProps = {
  course: Course
  refreshCourse?: () => void
}

export const CourseGrading: React.FC<
  React.PropsWithChildren<CourseGradingProps>
> = ({ course, refreshCourse = noop }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { acl } = useAuth()

  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [where, setWhere] = useState<Record<string, object>>({})

  const handleWhereConditionChange = (
    whereCondition: Record<string, object>,
  ) => {
    setWhere(whereCondition)
  }

  const {
    data: courseParticipants,
    total: courseParticipantsTotal,
    status,
    mutate: refreshParticipants,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: 'name',
    order,
    where: {
      _and: [{ attended: { _eq: true } }, where],
    },
  })

  useEffect(() => {
    refreshParticipants({ requestPolicy: 'network-only' })
  }, [refreshParticipants, where])

  const participantsWithoutGrades = (courseParticipants ?? []).filter(
    participant => !participant.grade,
  )

  const canEditGradingDetails = !course.gradingStarted
  const disableGradeAll = useMemo(() => {
    const participantFiltered =
      courseParticipants?.filter(participant => participant.grade !== null) ??
      []
    return participantFiltered.length === courseParticipants?.length
  }, [courseParticipants])

  const canGradeParticipants = acl.canGradeParticipants(course.trainers ?? [])

  const cols = useMemo(() => {
    return [
      canGradeParticipants
        ? {
            id: 'selection',
            label: '',
            sorting: false,
            component: (
              <Checkbox
                checked={
                  selectedParticipants.length ===
                    participantsWithoutGrades.length &&
                  selectedParticipants.length > 0
                }
                onChange={event => {
                  setSelectedParticipants(() =>
                    event.target.checked
                      ? participantsWithoutGrades.map(
                          participant => participant.id,
                        )
                      : [],
                  )
                }}
              />
            ),
          }
        : null,
      {
        id: 'name',
        label: t('pages.course-participants.name'),
        sorting: true,
      },
      {
        id: 'contact',
        label: t('common.email'),
        sorting: true,
      },
      {
        id: 'organisation',
        label: t('pages.course-participants.organisation'),
        sorting: false,
      },
      {
        id: 'grade',
        label: t('pages.course-details.tabs.grading.grade'),
        sorting: false,
      },
    ].filter(Boolean)
  }, [
    canGradeParticipants,
    selectedParticipants.length,
    participantsWithoutGrades,
    t,
  ])

  const handleSortChange = useCallback(
    (columnName: string) => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn],
  )

  const handleParticipantSelection = useCallback(
    (participantId: string, checked: boolean) => {
      setSelectedParticipants(prevState =>
        checked
          ? [...prevState, participantId]
          : prevState.filter(id => id !== participantId),
      )
    },
    [],
  )

  useEffectOnce(() => {
    refreshCourse()
  })

  return (
    <Box sx={{ paddingX: 0 }}>
      {course.gradingConfirmed ? (
        <>
          {status === LoadingStatus.FETCHING ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Grid
                container
                display="flex"
                justifyContent="space-between"
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <Typography variant="subtitle1" color="grey.800">
                  {t('pages.course-details.tabs.grading.title')}
                </Typography>
                {canGradeParticipants ? (
                  <Button
                    disabled={!canEditGradingDetails}
                    onClick={() => {
                      navigate(`/courses/${course.id}/grading/details`)
                    }}
                    fullWidth={isMobile}
                    startIcon={<Edit fontSize="small" />}
                  >
                    {t(
                      'pages.course-details.tabs.grading.modify-grading-details',
                    )}
                  </Button>
                ) : null}
              </Grid>

              <Typography variant="body1" color="grey.800" sx={{ my: 2 }}>
                <Trans
                  i18nKey="pages.course-details.tabs.grading.description"
                  values={{ email: import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS }}
                >
                  <Link
                    href={`mailto:${
                      import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS
                    }`}
                    underline="always"
                    rel="nofollow"
                  />
                </Trans>
              </Typography>

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2, p: 0 }}
                spacing={3}
              >
                <Grid item md={12} sx={{ marginTop: '15px' }}>
                  <CourseDetailsFilters
                    canViewEvaluationSubmittedColumn={false}
                    courseId={course.id}
                    handleWhereConditionChange={handleWhereConditionChange}
                  />
                </Grid>
                <Grid item container md={12} alignItems={'flex-end'}>
                  <Grid item md={6}>
                    <Typography variant="body1" color="grey.600">
                      {t('pages.course-details.tabs.grading.attendees', {
                        number: courseParticipantsTotal,
                      })}
                    </Typography>
                  </Grid>
                  {canGradeParticipants ? (
                    <Grid
                      item
                      container
                      md={6}
                      sm={12}
                      display="flex"
                      justifyContent="flex-end"
                      flexDirection={isMobile ? 'column' : 'row'}
                      spacing={2}
                    >
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={selectedParticipants.length === 0}
                          fullWidth={isMobile}
                          onClick={() =>
                            navigate(
                              `/courses/${
                                course.id
                              }/grading?participants=${selectedParticipants.join(
                                ',',
                              )}`,
                            )
                          }
                        >
                          {t(
                            'pages.course-details.tabs.grading.grade-selected',
                            {
                              number: selectedParticipants.length,
                            },
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={disableGradeAll}
                          fullWidth={isMobile}
                          onClick={() =>
                            navigate(`/courses/${course.id}/grading`)
                          }
                          data-testid="grade-all-attendees"
                        >
                          {t(
                            'pages.course-details.tabs.grading.grade-all-attendees',
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
              <Grid sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead
                    cols={cols}
                    order={order}
                    orderBy={sortColumn}
                    onRequestSort={handleSortChange}
                  />
                  <TableBody>
                    {courseParticipants?.map(courseParticipant => (
                      <TableRow
                        key={courseParticipant.id}
                        data-testid={`attending-participant-row-${courseParticipant.id}`}
                      >
                        {canGradeParticipants ? (
                          <TableCell>
                            <Checkbox
                              checked={selectedParticipants.includes(
                                courseParticipant.id,
                              )}
                              onChange={event =>
                                handleParticipantSelection(
                                  courseParticipant.id,
                                  event.target.checked,
                                )
                              }
                              disabled={Boolean(courseParticipant.grade)}
                            />
                          </TableCell>
                        ) : null}
                        <TableCell>
                          <LinkToProfile
                            profileId={courseParticipant.profile.id}
                            isProfileArchived={
                              courseParticipant.profile.archived
                            }
                          >
                            {courseParticipant.profile.archived
                              ? t('common.archived-profile')
                              : courseParticipant.profile.fullName}
                          </LinkToProfile>
                        </TableCell>
                        <TableCell>
                          <LinkToProfile
                            profileId={courseParticipant.profile.id}
                            isProfileArchived={
                              courseParticipant.profile.archived
                            }
                          >
                            {courseParticipant.profile.email}
                            {courseParticipant.profile.contactDetails.map(
                              contact => contact.value,
                            )}
                          </LinkToProfile>
                        </TableCell>
                        <TableCell>
                          {courseParticipant.profile.organizations.map(org => (
                            <Typography key={org.organization.id}>
                              {org.organization.name}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell data-testid="grade-cell">
                          {courseParticipant.grade ? (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grade grade={courseParticipant.grade} />
                              <Link
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.colors.navy[500],
                                }}
                                href={`/courses/${course.id}/grading/${courseParticipant.id}`}
                              >
                                {' '}
                                {t('common.view')}
                              </Link>
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              href={`/courses/${course.id}/grading?participants=${courseParticipant.id}`}
                              LinkComponent={LinkBehavior}
                              disabled={!canGradeParticipants}
                            >
                              {t('pages.course-details.tabs.grading.grade')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </>
          )}
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GradingDetailsAlert course={course}>
            {canGradeParticipants ? (
              <Box display="flex" justifyContent={'flex-end'}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ py: 1 }}
                  href={`/courses/${course.id}/grading/details`}
                  LinkComponent={LinkBehavior}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grade',
                    )}
                  </Typography>
                </Button>
              </Box>
            ) : null}
          </GradingDetailsAlert>
        </Box>
      )}
    </Box>
  )
}
