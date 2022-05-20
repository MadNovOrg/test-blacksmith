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
} from '@mui/material'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
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
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [messageSnackbarOpen, setMessageSnackbarOpen] = useState(false)

  const { data, status, total, resend } = useCourseInvites(
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
        label: t('pages.course-participants.contact'),
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
    setMessageSnackbarOpen(true)
  }

  return (
    <>
      {status === LoadingStatus.SUCCESS && (
        <>
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
                  <TableCell sx={{ textAlign: 'right' }}>
                    {invite.status === InviteStatus.PENDING && (
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ ml: 2 }}
                        onClick={() => handleResendInvite(invite)}
                        data-testid="course-resend-invite-btn"
                      >
                        {t('pages.course-participants.resend-invite')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
              <Typography variant="body1" color="grey.500">
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setMessageSnackbarOpen(false)}
      >
        <Alert onClose={() => setMessageSnackbarOpen(false)} severity="info">
          {t('pages.course-participants.invite-sent')}
        </Alert>
      </Snackbar>
    </>
  )
}
