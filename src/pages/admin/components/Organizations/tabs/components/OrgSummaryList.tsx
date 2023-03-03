import CloseIcon from '@mui/icons-material/Close'
import {
  AvatarGroup,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import Link from '@mui/material/Link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import theme from '@app/theme'

type OrgSummaryListParams = {
  orgId: string
}

export const OrgSummaryList: React.FC<
  React.PropsWithChildren<OrgSummaryListParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const { data, profilesByOrg, stats } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  return (
    <>
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
              {t('common.certification-status.expired')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(org => (
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
                  {profilesByOrg.get(org.id)?.map(profile => (
                    <Avatar
                      key={profile.id}
                      src={profile.avatar ?? ''}
                      name={
                        profile.archived ? undefined : profile.fullName ?? ''
                      }
                    >
                      {profile.archived ? <CloseIcon /> : null}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={stats[org.id].certificates.active.count}
                  size="small"
                  color="success"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={stats[org.id].certificates.expiringSoon.count}
                  size="small"
                  color="warning"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={stats[org.id].certificates.expired.count}
                  size="small"
                  color="error"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
