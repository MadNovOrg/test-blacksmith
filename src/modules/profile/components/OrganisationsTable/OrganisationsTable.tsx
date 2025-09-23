import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Link,
} from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { PROFILE_TABLE_SX, PROFILE_TABLE_ROW_SX } from '@app/util'

type OrganisationsTableProps = {
  profile: GetProfileDetailsQuery['profile']
}

export const OrganisationsTable: FC<
  PropsWithChildren<OrganisationsTableProps>
> = ({ profile }) => {
  const { acl } = useAuth()
  const { t } = useTranslation()
  const tableHeadCells = [t('organization'), t('permissions')]
  return (
    <Table data-testid="organisations-table">
      <TableHead>
        <TableRow sx={PROFILE_TABLE_SX}>
          {tableHeadCells.map(cell => (
            <TableCell key={cell}>{cell}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {profile?.organizations.length ? (
          profile.organizations.map((orgMember, index) => (
            <TableRow key={orgMember.id + index} sx={PROFILE_TABLE_ROW_SX}>
              <TableCell>
                {acl.isInternalUser() ? (
                  <Link href={`/organisations/${orgMember.organization.id}`}>
                    {orgMember.organization?.name}
                  </Link>
                ) : (
                  orgMember.organization?.name
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    orgMember.isAdmin
                      ? t('pages.org-details.tabs.users.organization-admin')
                      : t('pages.org-details.tabs.users.no-permissions')
                  }
                  color={orgMember.isAdmin ? 'success' : 'gray'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow sx={PROFILE_TABLE_ROW_SX}>
            <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
              {t('pages.my-profile.user-is-not-assigned-to-org')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
