import {
  Alert,
  Box,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import useCourseInvites from '@app/hooks/useCourseInvites'
import { Course, CourseInvite, InviteStatus, SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

type TabProperties = {
  course: Course
  inviteStatus: InviteStatus
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const InvitesTab = ({ course, inviteStatus }: TabProperties) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [messageSnackbarOpen, setMessageSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const { data, status, total, resend, cancel } = useCourseInvites(
    course?.id,
    inviteStatus,
    order,
    perPage,
    perPage * currentPage
  )

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  const handleSortChange = useCallback(
    () => setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc')),
    []
  )

  const cols = useMemo(
    () => [
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
      {
        id: 'actions',
        label: '',
        sorting: false,
      },
    ],
    [t]
  )

  const handleResendInvite = async (invite: CourseInvite) => {
    await resend(invite)
    setSnackbarMessage(t('pages.course-participants.invite-sent'))
    setMessageSnackbarOpen(true)
  }

  const handleCancelInvite = async (invite: CourseInvite) => {
    await cancel(invite)
    setSnackbarMessage(t('pages.course-participants.invite-cancelled'))
    setMessageSnackbarOpen(true)
  }

  return (
    <>
      {status === LoadingStatus.SUCCESS && (
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
                {data?.map(invite => (
                  <TableRow
                    key={invite.id}
                    data-testid={`course-invite-row-${invite.id}`}
                  >
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      {t('dates.default', { date: invite.createdAt })}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {invite.status === InviteStatus.PENDING &&
                        acl.canInviteAttendees(course.type) && (
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
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
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
                  `pages.course-participants.none-${inviteStatus.toLocaleLowerCase()}-message`
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
