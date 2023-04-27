import { Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Grade } from '@app/components/Grade'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { LinkToProfile } from '@app/components/LinkToProfile'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { Course, SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

import { GradingDetailsAlert } from './components/GradingDetailsAlert'

type CourseGradingProps = {
  course: Course
}

export const CourseGrading: React.FC<
  React.PropsWithChildren<CourseGradingProps>
> = ({ course }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { acl } = useAuth()

  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const {
    data: participants,
    status,
    total,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: 'name',
    order,
  })

  const participantsWithoutGrades = (participants ?? []).filter(
    participant => !participant.grade
  )

  const canEditGradingDetails = !course.gradingStarted
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
                          participant => participant.id
                        )
                      : []
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
        label: t('pages.course-participants.email'),
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
    [sortColumn]
  )

  const handleParticipantSelection = useCallback(
    (participantId: string, checked: boolean) => {
      setSelectedParticipants(prevState =>
        checked
          ? [...prevState, participantId]
          : prevState.filter(id => id !== participantId)
      )
    },
    []
  )

  return (
    <>
      <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" color="grey.800" mr={3}>
                    {t('pages.course-details.tabs.grading.title')}
                  </Typography>
                  {canGradeParticipants ? (
                    <Button
                      disabled={!canEditGradingDetails}
                      onClick={() => {
                        navigate(`/courses/${course.id}/grading-details`)
                      }}
                      startIcon={<Edit fontSize="small" />}
                    >
                      {t(
                        'pages.course-details.tabs.grading.modify-grading-details'
                      )}
                    </Button>
                  ) : null}
                </Box>

                <Typography variant="body1" color="grey.800" sx={{ my: 2 }}>
                  {t('pages.course-details.tabs.grading.description')}
                </Typography>

                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body1" color="grey.500">
                    {t('pages.course-details.tabs.grading.attendees', {
                      number: total,
                    })}
                  </Typography>

                  {canGradeParticipants ? (
                    <Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={selectedParticipants.length === 0}
                        onClick={() =>
                          navigate(
                            `/courses/${
                              course.id
                            }/grading?participants=${selectedParticipants.join(
                              ','
                            )}`
                          )
                        }
                      >
                        {t('pages.course-details.tabs.grading.grade-selected', {
                          number: selectedParticipants.length,
                        })}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={() =>
                          navigate(`/courses/${course.id}/grading`)
                        }
                        data-testid="grade-all-attendees"
                      >
                        {t(
                          'pages.course-details.tabs.grading.grade-all-attendees'
                        )}
                      </Button>
                    </Box>
                  ) : null}
                </Grid>

                <Table>
                  <TableHead
                    cols={cols}
                    order={order}
                    orderBy={sortColumn}
                    onRequestSort={handleSortChange}
                  />
                  <TableBody>
                    {participants?.map(courseParticipant => (
                      <TableRow
                        key={courseParticipant.id}
                        data-testid={`attending-participant-row-${courseParticipant.id}`}
                      >
                        {canGradeParticipants ? (
                          <TableCell>
                            <Checkbox
                              checked={selectedParticipants.includes(
                                courseParticipant.id
                              )}
                              onChange={event =>
                                handleParticipantSelection(
                                  courseParticipant.id,
                                  event.target.checked
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
                              contact => contact.value
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
                            <Box display="flex" alignItems="center">
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
                    href={`/courses/${course.id}/grading-details`}
                    LinkComponent={LinkBehavior}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {t(
                        'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grading-details'
                      )}
                    </Typography>
                  </Button>
                </Box>
              ) : null}
            </GradingDetailsAlert>
          </Box>
        )}
      </Container>
    </>
  )
}
