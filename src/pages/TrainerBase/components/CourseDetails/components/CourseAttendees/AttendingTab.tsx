import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'

import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { LoadingStatus } from '@app/util'
import {
  BlendedLearningStatus,
  Course,
  CourseDeliveryType,
  SortOrder,
} from '@app/types'

type TabProperties = {
  course: Course
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const AttendingTab = ({ course }: TabProperties) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [order, setOrder] = useState<SortOrder>('asc')
  const isBlendedCourse = course.deliveryType === CourseDeliveryType.BLENDED

  const {
    data: courseParticipants,
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: sortColumn,
    order,
    pagination: {
      limit: perPage,
      offset: perPage * currentPage,
    },
  })

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

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

  const cols = useMemo(
    () =>
      [
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
        isBlendedCourse
          ? {
              id: 'bl-status',
              label: t('bl-status'),
              sorting: true,
            }
          : null,
        {
          id: 'documents',
          label: t('pages.course-participants.documents'),
          sorting: false,
        },
      ].filter(Boolean),
    [t, isBlendedCourse]
  )

  return (
    <>
      {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
      courseParticipants?.length ? (
        <>
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
              {courseParticipants?.map(courseParticipant => (
                <TableRow
                  key={courseParticipant.id}
                  data-testid={`course-participant-row-${courseParticipant.id}`}
                >
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
                  {isBlendedCourse && (
                    <TableCell>
                      {courseParticipant.go1EnrolmentStatus && (
                        <Chip
                          label={t(
                            `blended-learning-status.${courseParticipant.go1EnrolmentStatus}`
                          )}
                          color={
                            courseParticipant.go1EnrolmentStatus ===
                            BlendedLearningStatus.COMPLETED
                              ? 'success'
                              : 'warning'
                          }
                        />
                      )}
                    </TableCell>
                  )}
                  <TableCell>View</TableCell>
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
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={4}
          data-testid="course-participants-zero-message"
        >
          <Typography variant="body1" color="grey.500">
            {t('pages.course-participants.none-registered-message')}
          </Typography>
        </Box>
      )}
    </>
  )
}
