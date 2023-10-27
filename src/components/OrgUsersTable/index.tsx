import { CheckCircle } from '@mui/icons-material'
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
  TableRow,
  Typography,
} from '@mui/material'
import Link from '@mui/material/Link'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { EditOrgUserModal } from '@app/components/OrgUsersTable/EditOrgUserModal'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { OrgMembersQuery } from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import theme from '@app/theme'
import { CertificateStatus, CourseLevel } from '@app/types'
import { getProfileCertificationLevels } from '@app/util'

import { CertificateStatusChip } from '../CertificateStatusChip'

import { useOrgMembers } from './useOrgMembers'

type OrgUsersTableParams = {
  orgId: string
  onChange?: () => void
  certificateStatus?: CertificateStatus[]
}

export const OrgUsersTable: React.FC<
  React.PropsWithChildren<OrgUsersTableParams>
> = ({ orgId, onChange, certificateStatus }) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const sorting = useTableSort('fullName', 'asc')

  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editedUser, setEditedUser] = useState<OrgMembersQuery['members'][0]>()

  const { offset, perPage, Pagination } = useTablePagination()

  const { members, fetching, total, refetch } = useOrgMembers({
    perPage,
    offset,
    orgId,
    sort: { by: sorting.by, dir: sorting.dir },
    certificateFilter: certificateStatus,
  })

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.org-details.tabs.users.cols-${col}`)
    const mandatoryCols = [
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
        id: 'go1',
        label: _t('blended-learning'),
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
      },
    ]

    const optionalCols = [
      {
        id: 'actions',
        label: '',
      },
    ]

    return [
      ...mandatoryCols,
      ...(acl.canEditOrgUser([orgId]) ? optionalCols : []),
    ] as Col[]
  }, [acl, t, orgId])

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table data-testid="organisation-members">
          <TableHead
            cols={cols}
            orderBy={sorting.by}
            order={sorting.dir}
            onRequestSort={sorting.onSort}
          />
          <TableBody>
            {fetching ? (
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
              noRecords={!fetching && !members?.length}
              itemsName={t('common.users').toLowerCase()}
              colSpan={cols.length}
            />

            {members?.map((member, index) => {
              const certificateLevelsToDisplay = getProfileCertificationLevels(
                member.profile.certificates as {
                  courseLevel: string
                  status: CertificateStatus
                }[]
              )
              const filteredCerts = member.profile.certificates.filter(
                cert =>
                  certificateLevelsToDisplay.indexOf(
                    cert.courseLevel as CourseLevel
                  ) >= 0
              )
              return (
                <TableRow
                  key={member.profile.id}
                  data-testid={`org-member-row-${member.id}`}
                  data-index={index}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ProfileAvatar
                        profile={member.profile}
                        renderLabel={name => (
                          <Box display="flex" flexDirection="column">
                            <Link
                              variant="body2"
                              color={theme.palette.grey[900]}
                              ml={1}
                              href={`/profile/${member.profile.id}?orgId=${orgId}`}
                            >
                              {name}
                            </Link>
                            {member?.position ? (
                              <Typography
                                variant="body2"
                                color="grey.600"
                                ml={1}
                              >
                                {member?.position}
                              </Typography>
                            ) : null}
                          </Box>
                        )}
                      />
                    </Box>
                  </TableCell>
                  <TableCell data-testid="member-certificates">
                    {filteredCerts.map(cert => {
                      const certificationStatus =
                        cert?.status as CertificateStatus
                      const statusTooltip =
                        cert.participant?.certificateChanges[0]?.payload?.note

                      return (
                        <Box
                          key={cert.id}
                          display="flex"
                          alignItems="center"
                          py={1}
                        >
                          <CertificateStatusChip
                            status={certificationStatus}
                            tooltip={statusTooltip}
                          />
                          <Typography variant="body2" ml={1}>
                            {t(
                              `common.certificates.${cert.courseLevel.toLowerCase()}`
                            )}
                          </Typography>
                        </Box>
                      )
                    })}
                  </TableCell>
                  <TableCell>
                    {member.profile.go1Licenses.length === 1 ? (
                      <CheckCircle color="success" />
                    ) : null}
                  </TableCell>
                  <TableCell data-testid="member-last-activity">
                    {t('dates.default', { date: member.profile.lastActivity })}
                  </TableCell>
                  <TableCell data-testid="member-created-at">
                    {t('dates.default', { date: member.profile.createdAt })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        member?.isAdmin
                          ? t('pages.org-details.tabs.users.organization-admin')
                          : t('pages.org-details.tabs.users.no-permissions')
                      }
                      color={member?.isAdmin ? 'success' : 'gray'}
                      size="small"
                    />
                  </TableCell>
                  {(member && member.isAdmin) ||
                  (acl.canEditOrgUser([orgId]) &&
                    (acl.canSetOrgAdminRole() || !member.isAdmin)) ? (
                    <TableCell>
                      <Button
                        data-testid="edit-user-button"
                        size="large"
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setEditedUser(member)
                          setShowEditUserModal(true)
                        }}
                      >
                        {t('common.edit')}
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {members?.length ? <Pagination total={total ?? 0} /> : null}
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
              refetch()
              if (onChange) onChange()
            }}
          />
        </Dialog>
      ) : null}
    </>
  )
}
