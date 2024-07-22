import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material'
import MuiTableHead from '@mui/material/TableHead'
import { groupBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useOrgInvites } from '@app/components/OrgInvitesTable/hooks/useOrgInvites'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { Course_Invite_Status_Enum } from '@app/generated/graphql'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

type OrgInvitesTableParams = {
  orgId: string
}

export const OrgInvitesTable: React.FC<
  React.PropsWithChildren<OrgInvitesTableParams>
> = ({ orgId }) => {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)

  const { invites, loading, totalCount, resend, cancel } = useOrgInvites(
    orgId,
    {
      limit: perPage,
      offset: perPage * currentPage,
    },
  )

  const invitesByStatus = useMemo(() => {
    if (!invites) return []
    const byStatus = groupBy(
      invites,
      inv => inv.status === Course_Invite_Status_Enum.Pending,
    )
    return [...(byStatus['true'] ?? []), ...(byStatus['false'] ?? [])]
  }, [invites])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <MuiTableHead>
            <TableRow>
              <TableCell>{t('common.email')}</TableCell>
              <TableCell>
                {t('pages.org-details.tabs.users.invited-on')}
              </TableCell>
              <TableCell>
                {t('pages.org-details.tabs.users.permissions')}
              </TableCell>
              <TableCell>{t('common.status')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </MuiTableHead>
          <TableBody data-testid="org-users-table">
            {loading ? (
              <TableRow
                sx={{
                  '&&.MuiTableRow-root': {
                    backgroundColor: 'grey.300',
                  },
                  '&& .MuiTableCell-root': {
                    px: 2,
                    py: 1,
                    color: 'grey.700',
                    fontWeight: '600',
                  },
                }}
              >
                <TableCell colSpan={4}>
                  <Stack direction="row" alignItems="center">
                    <CircularProgress size={20} />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}

            <TableNoRows
              noRecords={!loading && !invites?.length}
              itemsName={t('invites').toLowerCase()}
              colSpan={4}
            />

            {invitesByStatus.map(invite => {
              return (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    {t('dates.default', { date: invite.createdAt })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        invite.isAdmin
                          ? t('pages.org-details.tabs.users.organization-admin')
                          : t('pages.org-details.tabs.users.no-permissions')
                      }
                      color={invite.isAdmin ? 'success' : 'gray'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(
                        `pages.org-details.tabs.users.invite-status.${invite.status.toLowerCase()}`,
                      )}
                      color={
                        invite.status === Course_Invite_Status_Enum.Accepted
                          ? 'success'
                          : invite.status === Course_Invite_Status_Enum.Declined
                          ? 'error'
                          : 'secondary'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {invite.status === Course_Invite_Status_Enum.Pending ? (
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          data-testid="resend-invite-button"
                          size="large"
                          variant="text"
                          color="primary"
                          onClick={() => resend(invite.id)}
                        >
                          {t('common.resend')}
                        </Button>
                        <Button
                          data-testid="cancel-invite-button"
                          size="large"
                          variant="text"
                          color="primary"
                          onClick={() => cancel(invite.id)}
                        >
                          {t('common.cancel-invite')}
                        </Button>
                      </Box>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount ? (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage}
          onPageChange={(_, page) => setCurrentPage(page)}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={perPage}
          rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
        />
      ) : null}
    </>
  )
}
