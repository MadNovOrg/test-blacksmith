import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {
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
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { EditOrgUserModal } from '@app/components/OrgUsersTable/EditOrgUserModal'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useOrgUsers } from '@app/hooks/useOrgUsers'
import { useTableSort } from '@app/hooks/useTableSort'
import theme from '@app/theme'
import { OrganizationMember } from '@app/types'

type OrgUsersTableParams = {
  orgId: string
  onChange?: () => void
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const OrgUsersTable: React.FC<OrgUsersTableParams> = ({
  orgId,
  onChange,
}) => {
  const { t } = useTranslation()

  const sorting = useTableSort('fullName', 'asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editedUser, setEditedUser] = useState<OrganizationMember>()

  // TODO use useOrg instead for certificate, enrolled etc
  const { users, loading, totalCount, mutate } = useOrgUsers(orgId, {
    sorting,
    limit: perPage,
    offset: perPage * currentPage,
  })

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.org-details.tabs.users.cols-${col}`)
    return [
      {
        id: 'fullName',
        label: _t('name'),
        sorting: true,
      },
      {
        id: 'certification',
        label: _t('certification'),
      },
      {
        id: 'lastActivity',
        label: _t('last-activity'),
        sorting: true,
      },
      {
        id: 'createdAt',
        label: _t('created-on'),
        sorting: true,
      },
      {
        id: 'permissions',
        label: _t('permissions'),
        sorting: true,
      },
      {
        id: 'actions',
        label: '',
      },
    ] as Col[]
  }, [t])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead
            cols={cols}
            orderBy={sorting.by}
            order={sorting.dir}
            onRequestSort={sorting.onSort}
          />
          <TableBody>
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
                <TableCell colSpan={cols.length}>
                  <Stack direction="row" alignItems="center">
                    <CircularProgress size={20} />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}

            <TableNoRows
              noRecords={!loading && !users?.length}
              itemsName={t('users').toLowerCase()}
              colSpan={cols.length}
            />

            {users?.map(user => {
              return (
                <TableRow key={user.profile.id}>
                  <TableCell>
                    <Typography>{user.profile.fullName}</Typography>
                    <Typography
                      variant="caption"
                      color={theme.palette.grey[600]}
                    >
                      {user.position}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {user.profile.activeCertificates.aggregate.count > 0 ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {t('dates.default', { date: user.profile.lastActivity })}
                  </TableCell>
                  <TableCell>
                    {t('dates.default', { date: user.profile.createdAt })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.isAdmin
                          ? t('pages.org-details.tabs.users.organization-admin')
                          : t('pages.org-details.tabs.users.no-permissions')
                      }
                      color={user.isAdmin ? 'success' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      data-testid="edit-user-button"
                      size="large"
                      variant="text"
                      color="primary"
                      onClick={() => {
                        setEditedUser(user)
                        setShowEditUserModal(true)
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {totalCount ? (
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={perPage}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          />
        ) : null}
      </TableContainer>
      {editedUser ? (
        <Dialog
          maxWidth={800}
          open={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          title={t('pages.org-details.tabs.users.edit-user-modal.title', {
            name: editedUser.profile?.fullName,
          })}
          subtitle={
            <Typography color={theme.palette.grey[700]}>
              {t(
                'pages.org-details.tabs.users.edit-user-modal.modification-info'
              )}
            </Typography>
          }
        >
          <EditOrgUserModal
            orgMember={editedUser}
            onClose={() => setShowEditUserModal(false)}
            onChange={async () => {
              await mutate()
              if (onChange) onChange()
            }}
          />
        </Dialog>
      ) : null}
    </>
  )
}
