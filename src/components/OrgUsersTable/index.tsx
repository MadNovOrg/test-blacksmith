import { CheckCircle } from '@mui/icons-material'
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
import Link from '@mui/material/Link'
import { Box } from '@mui/system'
import { sortBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { EditOrgUserModal } from '@app/components/OrgUsersTable/EditOrgUserModal'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import useOrg, { ProfileType } from '@app/hooks/useOrg'
import { useTableSort } from '@app/hooks/useTableSort'
import theme from '@app/theme'
import { CertificateStatus, CourseLevel } from '@app/types'
import { getProfileCertificationLevels } from '@app/util'

import { CertificateStatusChip } from '../CertificateStatusChip'

type OrgUsersTableParams = {
  orgId: string
  onChange?: () => void
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const OrgUsersTable: React.FC<
  React.PropsWithChildren<OrgUsersTableParams>
> = ({ orgId, onChange }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const sorting = useTableSort('fullName', 'asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editedUser, setEditedUser] =
    useState<ProfileType['organizations'][0]>()

  const { profiles: orgProfiles, loading } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

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
      ...(acl.canEditOrgUser() ? optionalCols : []),
    ] as Col[]
  }, [acl, t])

  const currentPageProfiles = useMemo(() => {
    const profiles = orgProfiles || []
    let sorted
    if (sorting.by === 'fullName') {
      sorted = sortBy(profiles, p => p.fullName)
    } else if (sorting.by === 'lastActivity') {
      sorted = sortBy(profiles, p => p.lastActivity)
    } else {
      sorted = sortBy(profiles, p => p.createdAt)
    }
    if (sorting.dir === 'desc') sorted = sorted.reverse()
    return sorted.slice(currentPage * perPage, currentPage * perPage + perPage)
  }, [currentPage, orgProfiles, perPage, sorting])

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
        <Table data-testid="organisation-members">
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
              noRecords={!loading && !currentPageProfiles?.length}
              itemsName={t('common.users').toLowerCase()}
              colSpan={cols.length}
            />

            {currentPageProfiles?.map(profile => {
              const orgMember = profile.organizations.find(
                org => org.organization.id === orgId
              )
              const certificateLevelsToDisplay = getProfileCertificationLevels(
                profile.certificates as {
                  courseLevel: string
                  status: CertificateStatus
                }[]
              )
              const filteredCerts = profile.certificates.filter(
                cert =>
                  certificateLevelsToDisplay.indexOf(
                    cert.courseLevel as CourseLevel
                  ) >= 0
              )
              return (
                <TableRow key={profile.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ProfileAvatar
                        profile={profile}
                        renderLabel={name => (
                          <Box display="flex" flexDirection="column">
                            <Link
                              variant="body2"
                              color={theme.palette.grey[900]}
                              ml={1}
                              href={`/profile/${profile.id}?orgId=${orgId}`}
                            >
                              {name}
                            </Link>
                            {orgMember?.position ? (
                              <Typography
                                variant="body2"
                                color="grey.600"
                                ml={1}
                              >
                                {orgMember?.position}
                              </Typography>
                            ) : null}
                          </Box>
                        )}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
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
                    {profile.go1Licenses.length === 1 ? (
                      <CheckCircle color="success" />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {t('dates.default', { date: profile.lastActivity })}
                  </TableCell>
                  <TableCell>
                    {t('dates.default', { date: profile.createdAt })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        orgMember?.isAdmin
                          ? t('pages.org-details.tabs.users.organization-admin')
                          : t('pages.org-details.tabs.users.no-permissions')
                      }
                      color={orgMember?.isAdmin ? 'success' : 'gray'}
                      size="small"
                    />
                  </TableCell>
                  {acl.canEditOrgUser() ? (
                    <TableCell>
                      <Button
                        data-testid="edit-user-button"
                        size="large"
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setEditedUser(orgMember)
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
      {orgProfiles ? (
        <TablePagination
          component="div"
          count={orgProfiles.length}
          page={currentPage}
          onPageChange={(_, page) => setCurrentPage(page)}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={perPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      ) : null}
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
              if (onChange) onChange()
            }}
          />
        </Dialog>
      ) : null}
    </>
  )
}
