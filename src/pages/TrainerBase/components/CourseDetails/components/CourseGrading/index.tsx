import React, { useCallback, useMemo, useState } from 'react'
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
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

import { TableHead } from '@app/components/Table/TableHead'

import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { Course, SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

type CourseGradingProps = {
  course: Course
}

const gradeToIconMap = {
  PASS: <CheckCircleIcon color="success" />,
  OBSERVE_ONLY: <CheckCircleIcon color="tertiary" />,
  FAIL: <CancelIcon color="error" />,
  ASSIST_ONLY: <CheckCircleIcon color="tertiary" />,
}

export const CourseGrading: React.FC<CourseGradingProps> = ({ course }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()

  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const {
    data: attendingParticipants,
    status,
    total,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: 'name',
    order,
    where: {
      attended: { _eq: true },
    },
  })

  const cols = useMemo(() => {
    const participantsWithoutGrades = (attendingParticipants ?? []).filter(
      participant => participant.gradings.length === 0
    )
    return [
      {
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
                  ? participantsWithoutGrades.map(participant => participant.id)
                  : []
              )
            }}
          />
        ),
      },
      {
        id: 'name',
        label: t('pages.course-participants.name'),
        sorting: true,
      },
      {
        id: 'contact',
        label: t('pages.course-participants.contact'),
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
  }, [attendingParticipants, selectedParticipants.length, t])

  const handleSortChange = useCallback(
    columnName => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn]
  )

  const handleParticipantSelection = useCallback((participantId, checked) => {
    setSelectedParticipants(prevState =>
      checked
        ? [...prevState, participantId]
        : prevState.filter(id => id !== participantId)
    )
  }, [])

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
                <Typography variant="subtitle1" color="grey.800">
                  {t('pages.course-details.tabs.grading.title')}
                </Typography>

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

                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={selectedParticipants.length === 0}
                      onClick={() =>
                        navigate(
                          `/trainer-base/course/${
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
                        navigate(`/trainer-base/course/${course.id}/grading`)
                      }
                    >
                      {t(
                        'pages.course-details.tabs.grading.grade-all-attendees'
                      )}
                    </Button>
                  </Box>
                </Grid>

                <Table>
                  <TableHead
                    cols={cols}
                    order={order}
                    orderBy={sortColumn}
                    onRequestSort={handleSortChange}
                    sx={{
                      '& .MuiTableRow-root': {
                        backgroundColor: 'grey.300',
                      },
                    }}
                  />
                  <TableBody>
                    {attendingParticipants?.map(courseParticipant => (
                      <TableRow
                        key={courseParticipant.id}
                        data-testid={`attending-participant-row-${courseParticipant.id}`}
                      >
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
                            disabled={courseParticipant.gradings.length > 0}
                          />
                        </TableCell>
                        <TableCell>
                          {courseParticipant.profile.givenName}{' '}
                          {courseParticipant.profile.familyName}
                        </TableCell>
                        <TableCell>
                          {courseParticipant.profile.email}
                          {courseParticipant.profile.contactDetails.map(
                            contact => contact.value
                          )}
                        </TableCell>
                        <TableCell>
                          {courseParticipant.profile.organizations.map(org => (
                            <Typography key={org.organization.id}>
                              {org.organization.name}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell>
                          {courseParticipant.gradings.length > 0 ? (
                            <Box display="flex" mb={2} alignItems="center">
                              {
                                gradeToIconMap[
                                  courseParticipant.gradings[0].grade
                                ]
                              }
                              <Typography
                                display="inline"
                                variant="body1"
                                sx={{ mx: 1 }}
                              >
                                {t(
                                  `common.grade.${courseParticipant.gradings[0].grade}`
                                )}
                              </Typography>
                              <Link
                                component="button"
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.colors.navy[500],
                                }}
                                href={`/trainer-base/course/${course.id}/grading?participants=${courseParticipant.id}`}
                              >
                                {t('common.view')}
                              </Link>
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/trainer-base/course/${course.id}/grading?participants=${courseParticipant.id}`
                                )
                              }
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
            <Box
              maxWidth="sm"
              sx={{
                borderRadius: 1,
                backgroundColor: theme.colors.navy[50],
                padding: 3,
              }}
            >
              <Typography display="inline" variant="body2" fontWeight="600">
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.line1'
                ) + ' '}
              </Typography>
              <Typography display="inline" variant="body2">
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.line2'
                )}
              </Typography>
              <ol>
                <li>
                  <Typography display="inline" variant="body2" fontWeight="600">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line3'
                    ) + ' '}
                  </Typography>
                  <Typography display="inline" variant="body2">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line4'
                    ) + ' '}
                  </Typography>
                </li>
                <li>
                  <Typography display="inline" variant="body2" fontWeight="600">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line5'
                    ) + ' '}
                  </Typography>
                  <Typography display="inline" variant="body2">
                    {t(
                      'pages.course-details.tabs.grading.grading-details-confirmation.line6'
                    ) + ' '}
                  </Typography>
                </li>
              </ol>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  navigate(`/trainer-base/course/${course.id}/grading-details`)
                }
              >
                {t(
                  'pages.course-details.tabs.grading.grading-details-confirmation.confirm-grading-details'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  )
}
