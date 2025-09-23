import {
  Alert,
  Box,
  Button,
  Chip,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Type_Enum,
  GetCourseInvitesQuery,
} from '@app/generated/graphql'
import useCourseInvites from '@app/modules/course_details/course_attendees_tab/hooks/useCourseInvites/useCourseInvites'
import { Course, SortOrder } from '@app/types'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

type TabProperties = {
  course: Course
  inviteStatus: Course_Invite_Status_Enum
  invitesData: GetCourseInvitesQuery['courseInvites']
}

export const InvitesTab = ({
  course,
  inviteStatus,
  invitesData,
}: TabProperties) => {
  const { t } = useTranslation()
  const { acl, profile } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [messageSnackbarOpen, setMessageSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [invites, setInvites] = useState<
    GetCourseInvitesQuery['courseInvites']
  >([])
  const isClosedIndirectCourse =
    course.type === Course_Type_Enum.Closed ||
    course.type === Course_Type_Enum.Indirect

  const courseEndDate = useMemo(
    () => (course?.schedule?.length ? course?.schedule[0].end : undefined),
    [course?.schedule],
  )
  const { data, fetching, total, resend, cancel } = useCourseInvites({
    courseId: course?.id,
    inviter: profile?.id ?? null,
    status: inviteStatus,
    order,
    limit: perPage,
    offset: perPage * currentPage,
    courseEnd: courseEndDate,
  })

  useEffect(() => {
    if (data?.length !== invitesData.length) {
      setInvites(invitesData)
    } else {
      setInvites(data)
    }
  }, [data, setInvites, invitesData])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  const handleSortChange = useCallback(
    () => setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc')),
    [],
  )

  const cols = useMemo(
    () =>
      [
        {
          id: 'contact',
          label: t('common.email'),
          sorting: true,
        },
        {
          id: 'createdAt',
          label: t('pages.course-participants.invite-date'),
          sorting: true,
        },
        isClosedIndirectCourse &&
        inviteStatus === Course_Invite_Status_Enum.Pending
          ? {
              id: 'expirationDate',
              label: t('pages.course-participants.invite-expiration'),
              sorting: true,
            }
          : null,
        isClosedIndirectCourse &&
        inviteStatus === Course_Invite_Status_Enum.Declined
          ? {
              id: 'note',
              label: t('common.notes'),
              sorting: true,
            }
          : null,
        {
          id: 'actions',
          label: '',
          sorting: false,
        },
      ].filter(Boolean),
    [t, inviteStatus, isClosedIndirectCourse],
  )

  const handleResendInvite = async (
    invite: GetCourseInvitesQuery['courseInvites'][0],
  ) => {
    await resend(invite)
    setSnackbarMessage(t('pages.course-participants.invite-sent'))
    setMessageSnackbarOpen(true)
  }

  const handleCancelInvite = async (
    invite: GetCourseInvitesQuery['courseInvites'][0],
  ) => {
    await cancel(invite)
    setSnackbarMessage(t('pages.course-participants.invite-cancelled'))
    setMessageSnackbarOpen(true)
  }

  return (
    <>
      {!fetching && (
        <>
          <Box sx={{ overflowX: 'auto' }}>
            <Table data-testid="invites-table">
              <TableHead
                cols={cols}
                order={order}
                orderBy="contact"
                onRequestSort={handleSortChange}
              />
              <TableBody>
                {invites?.map(invite => (
                  <TableRow
                    key={invite.id}
                    data-testid={`course-invite-row-${invite.id}`}
                  >
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      {t('dates.default', { date: invite.createdAt })}
                    </TableCell>
                    {isClosedIndirectCourse &&
                    inviteStatus === Course_Invite_Status_Enum.Pending ? (
                      <TableCell>
                        {invite.expiresIn
                          ? t('dates.default', { date: invite.expiresIn })
                          : ''}
                        {invite.expiresIn &&
                        new Date() > new Date(invite.expiresIn) ? (
                          <Chip
                            sx={{ ml: 1 }}
                            label={t('common.certification-status.expired')}
                            color={'error'}
                            size="small"
                          />
                        ) : null}
                      </TableCell>
                    ) : null}
                    {isClosedIndirectCourse &&
                    inviteStatus === Course_Invite_Status_Enum.Declined ? (
                      <TableCell>{invite.note}</TableCell>
                    ) : null}
                    <TableCell sx={{ textAlign: 'right' }}>
                      {invite.status === Course_Invite_Status_Enum.Pending &&
                        acl.canInviteAttendees(
                          course.type,
                          course.status,
                          course,
                        ) && (
                          <>
                            <Button
                              variant="text"
                              color="primary"
                              sx={{
                                ml: 2,
                                minWidth: isMobile ? '200px' : undefined,
                              }}
                              onClick={() => handleResendInvite(invite)}
                              data-testid={`course-resend-invite-btn-${invite.id}`}
                            >
                              {t('pages.course-participants.resend-invite')}
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              sx={{
                                ml: 2,
                                minWidth: isMobile ? '200px' : undefined,
                              }}
                              onClick={() => handleCancelInvite(invite)}
                              data-testid={`course-cancel-invite-btn-${invite.id}`}
                            >
                              {t('pages.course-participants.cancel-invite')}
                            </Button>
                          </>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {total ? (
            <TablePagination
              component="div"
              count={total}
              page={currentPage}
              onPageChange={(_, page) => setCurrentPage(page)}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={perPage}
              rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
              data-testid="course-invites-pagination"
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={4}
              data-testid="no-invites-message"
            >
              <Typography variant="body1" color="grey.600">
                {t(
                  `pages.course-participants.none-${inviteStatus.toLocaleLowerCase()}-message`,
                )}
              </Typography>
            </Box>
          )}
        </>
      )}
      <Snackbar
        open={messageSnackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setMessageSnackbarOpen(false)}
      >
        <Alert onClose={() => setMessageSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
