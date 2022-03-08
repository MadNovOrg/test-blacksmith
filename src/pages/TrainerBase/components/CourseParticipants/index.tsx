import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Table,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  Stack,
  TablePagination,
  Alert,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'

import useCourseParticipants from '@app/hooks/useCourseParticipants'
import useCourse from '@app/hooks/useCourse'

import { CourseHeroSummary } from './CourseHeroSummary'
import { CourseInvites } from './CourseInvites'

import { LoadingStatus } from '@app/util'
import { SortOrder } from '@app/types'

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const CourseParticipants = () => {
  const { id: courseId } = useParams()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [order, setOrder] = useState<SortOrder>('asc')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  const {
    data: courseParticipants,
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
    error: courseParticipantsError,
  } = useCourseParticipants(
    courseId ?? '',
    {
      limit: perPage,
      offset: perPage * currentPage,
    },
    order
  )

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  const cols = useMemo(
    () => [
      { id: 'name', label: t('pages.course-participants.name'), sorting: true },
      {
        id: 'contact',
        label: t('pages.course-participants.contact'),
        sorting: false,
      },
      {
        id: 'organisation',
        label: t('pages.course-participants.organisation'),
        sorting: false,
      },
      {
        id: 'prerequisites',
        label: t('pages.course-participants.Prerequisites'),
        sorting: false,
      },
    ],
    [t]
  )

  if (courseLoadingStatus === LoadingStatus.FETCHING) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="course-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}
      {course ? (
        <>
          <CourseHeroSummary course={course}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              sx={{ marginBottom: 2 }}
              onClick={() => navigate('/trainer-base/course')}
            >
              {t('pages.course-participants.back-button')}
            </Button>
          </CourseHeroSummary>
          <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
            {courseParticipantsLoadingStatus === LoadingStatus.FETCHING ? (
              <Stack
                alignItems="center"
                paddingTop={2}
                data-testid="course-participants-fetching"
              >
                <CircularProgress />
              </Stack>
            ) : null}

            {courseParticipantsError ? (
              <Alert severity="error">
                There was an error loading course participants.
              </Alert>
            ) : null}

            {!courseParticipantsError &&
            courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
            !courseParticipants?.length ? (
              <Alert severity="info">
                {t('pages.course-participants.no-participants-registered')}
              </Alert>
            ) : null}

            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle2" fontSize="18px">
                {t('pages.course-participants.attending', {
                  attending: courseParticipantsTotal,
                  max: course.max_participants,
                })}
              </Typography>
              <CourseInvites course={course} />
            </Grid>

            {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
            courseParticipants?.length ? (
              <>
                <Table>
                  <TableHead
                    cols={cols}
                    order={order}
                    orderBy="name"
                    onRequestSort={() => {
                      setOrder(order === 'asc' ? 'desc' : 'asc')
                    }}
                  />
                  <TableBody>
                    {courseParticipants?.map(courseParticipant => (
                      <TableRow
                        key={courseParticipant.id}
                        data-testid={`course-participant-row-${courseParticipant.id}`}
                      >
                        <TableCell>
                          {courseParticipant.firstName}{' '}
                          {courseParticipant.lastName}
                        </TableCell>
                        <TableCell>
                          {courseParticipant.contactDetails.map(
                            contact => contact.value
                          )}
                        </TableCell>
                        <TableCell>
                          {courseParticipant.organization?.name}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {courseParticipantsTotal ? (
                  <TablePagination
                    component="div"
                    count={courseParticipantsTotal}
                    page={currentPage}
                    onPageChange={(_, page) => setCurrentPage(page)}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={perPage}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    data-testid="course-participants-pagination"
                  />
                ) : null}
              </>
            ) : null}
          </Container>
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
