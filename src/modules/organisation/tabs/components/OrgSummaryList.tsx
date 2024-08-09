import CloseIcon from '@mui/icons-material/Close'
import {
  AvatarGroup,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import Link from '@mui/material/Link'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { useOrganisationProfiles } from '@app/modules/organisation/hooks/useOrganisationProfiles'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { Avatar } from '@app/modules/profile/components/Avatar'
import theme from '@app/theme'

import { useIndividualOrganizationStatistics } from '../../hooks/useIndividualOrganizationStatistics'

type OrgSummaryListParams = {
  orgId: string
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const OrgSummaryList: React.FC<
  React.PropsWithChildren<OrgSummaryListParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const showAllOrgs = acl.canViewAllOrganizations()

  const { profilesByOrganisation } = useOrganisationProfiles({
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
  })

  const { data, reexecute } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: showAllOrgs,
    shallow: true,
    limit: perPage,
    offset: perPage * currentPage,
  })

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
      reexecute()
    },
    [reexecute],
  )

  const { data: orgStats } = useIndividualOrganizationStatistics(
    data?.orgs.map(org => org.id) ?? [],
  )

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table data-testid="organisation-summary-table">
        <TableHead>
          <TableRow
            sx={{
              '&&.MuiTableRow-root': {
                backgroundColor: 'grey.300',
              },
              '&& .MuiTableCell-root': {
                px: 2,
                py: 1,
                color: theme.palette.secondaryGrey.main,
                fontWeight: 'bold',
              },
            }}
          >
            <TableCell>{t('common.organization')}</TableCell>
            <TableCell>{t('common.city')}</TableCell>
            <TableCell align="center">{t('common.individuals')}</TableCell>
            <TableCell align="center">
              {t('common.certification-status.active')}
            </TableCell>
            <TableCell align="center">
              {t('common.certification-status.expiring_soon')}
            </TableCell>
            <TableCell align="center">
              {t('common.certification-status.on_hold')}
            </TableCell>
            <TableCell align="center">
              {t('common.certification-status.expired_recently')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.orgs?.map(org => {
            const orgStat = orgStats?.organizations_statistics.find(
              orgStat => orgStat.organization_id === org.id,
            )
            return (
              <TableRow key={org.id} sx={{ backgroundColor: 'white' }}>
                <TableCell>
                  {org?.id === orgId ? (
                    org?.name
                  ) : (
                    <Link href={`/organisations/${org?.id}`} variant="body2">
                      {org?.name}
                    </Link>
                  )}
                </TableCell>
                <TableCell>{org.address?.city}</TableCell>
                <TableCell>
                  <Link
                    href={`/organisations/${org?.id}`}
                    underline="none"
                    ml={-1}
                  >
                    <AvatarGroup
                      max={4}
                      sx={{
                        justifyContent: 'center',
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          fontSize: 15,
                        },
                      }}
                    >
                      {profilesByOrganisation.get(org.id)?.map(profile => (
                        <Link
                          href={`/profile/${profile?.id}`}
                          key={profile?.id}
                          underline="none"
                          ml={-1}
                        >
                          <Avatar
                            src={profile?.avatar ?? ''}
                            name={
                              profile?.archived
                                ? undefined
                                : profile?.fullName ?? ''
                            }
                          >
                            {profile?.archived ? <CloseIcon /> : null}
                          </Avatar>
                        </Link>
                      ))}
                    </AvatarGroup>
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={orgStat?.active_certifications ?? 0}
                    size="small"
                    color="success"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={orgStat?.expiring_soon_certifications ?? 0}
                    size="small"
                    color="warning"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={orgStat?.on_hold_certifications ?? 0}
                    size="small"
                    color="warning"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={orgStat?.expired_recently_certifications ?? 0}
                    size="small"
                    color="error"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data?.orgsCount.aggregate?.count ?? 0}
        page={currentPage}
        onPageChange={(_, page) => setCurrentPage(page)}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={perPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        data-testid="organization-summary-pagination"
      />
    </Box>
  )
}
