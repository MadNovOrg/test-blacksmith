import MoveDownIcon from '@mui/icons-material/MoveDown'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
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
import Link from '@mui/material/Link'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ActionsMenu } from '@app/components/ActionsMenu'
import {
  Mode,
  ReplaceParticipantDialog,
} from '@app/components/ReplaceParticipantDialog'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import { RemoveIndividualModal } from '@app/pages/trainer-pages/components/CourseAttendees/RemoveIndividualModal'
import { Matcher } from '@app/queries/participants/get-course-participants'
import {
  BlendedLearningStatus,
  Course,
  CourseParticipant,
  CourseType,
  SortOrder,
} from '@app/types'
import { LoadingStatus } from '@app/util'

type TabProperties = {
  course: Course
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const AttendingTab = ({ course }: TabProperties) => {
  const { isOrgAdmin, acl } = useAuth()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [individual, setIndividual] = useState<CourseParticipant>()
  const [participantToReplace, setParticipantToReplace] =
    useState<CourseParticipant>()
  const isBlendedCourse = course.go1Integration
  const isOpenCourse = course.type === CourseType.OPEN
  const navigate = useNavigate()

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

  const matchMutate = useMatchMutate()

  const invalidateCache = useCallback(() => matchMutate(Matcher), [matchMutate])

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
        isOpenCourse
          ? {
              id: 'actions',
              label: '',
              sorting: false,
            }
          : null,
      ].filter(Boolean),
    [t, isBlendedCourse, isOpenCourse]
  )

  const handleTransfer = useCallback(
    (id: string) => {
      navigate(`../transfer/${id}`)
    },
    [navigate]
  )

  const actions = useMemo(() => {
    return [
      {
        label: t('common.replace'),
        icon: <MoveDownIcon color="primary" />,
        onClick: (participant: CourseParticipant) => {
          setParticipantToReplace(participant)
        },
      },
      {
        label: t('common.transfer'),
        icon: <SwapHorizIcon color="primary" />,
        onClick: (p: CourseParticipant) => {
          handleTransfer(p.id)
        },
      },
      {
        label: t('common.remove'),
        icon: <PersonRemoveIcon color="primary" />,
        onClick: (participant: CourseParticipant) => {
          setIndividual(participant)
        },
      },
    ]
  }, [t, handleTransfer])

  return (
    <>
      {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
      courseParticipants?.length ? (
        <>
          <Table data-testid="attending-table">
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
                  data-testid={`course-participant-row-${courseParticipant.id}`}
                >
                  <TableCell>{courseParticipant.profile.fullName}</TableCell>
                  <TableCell>
                    {acl.canViewEmailContacts(course.type) ? (
                      <Link href={`/profile/${courseParticipant.profile.id}`}>
                        {courseParticipant.profile.email}
                        {courseParticipant.profile.contactDetails.map(
                          contact => contact.value
                        )}
                      </Link>
                    ) : (
                      <Box>***************</Box>
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
                  {isOpenCourse ? (
                    <TableCell>
                      <ActionsMenu
                        item={courseParticipant}
                        label={t('pages.course-participants.manage-attendance')}
                        actions={actions}
                      />
                    </TableCell>
                  ) : null}
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

          {individual ? (
            <RemoveIndividualModal
              participant={individual}
              course={course}
              onClose={() => setIndividual(undefined)}
              onSave={invalidateCache}
            />
          ) : null}

          {participantToReplace ? (
            <ReplaceParticipantDialog
              participant={{
                id: participantToReplace.id,
                fullName: participantToReplace.profile.fullName,
                avatar: participantToReplace.profile.avatar,
              }}
              onClose={() => setParticipantToReplace(undefined)}
              onSuccess={invalidateCache}
              mode={isOrgAdmin ? Mode.ORG_ADMIN : Mode.TT_ADMIN}
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
            {course?.type === CourseType.OPEN
              ? t('pages.course-participants.no-attendees')
              : t('pages.course-participants.none-registered-message')}
          </Typography>
        </Box>
      )}
    </>
  )
}
