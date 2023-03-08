import { Box, TableCell, Link } from '@mui/material'
import React from 'react'

import { OrganizationInfo, Maybe } from '@app/generated/graphql'
import { Address } from '@app/types'

type Props = {
  organization?: Maybe<OrganizationInfo>
}

export const BillToCell: React.FC<Props> = ({ organization }) => {
  const formatOrganizationAddress = (address: Address) => {
    const { line1, line2, city, country, postCode } = address

    const formattedAddress = [line1, line2, city, country]
      .filter(Boolean)
      .join(', ')

    return (
      <span>
        {formattedAddress},{' '}
        <span style={{ whiteSpace: 'nowrap' }}>{postCode}</span>
      </span>
    )
  }

  return (
    <TableCell>
      {organization && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Link
            href={`/organisations/${organization.id}`}
            sx={{ display: 'inline-flex', flexDirection: 'column' }}
          >
            <span>{organization.name}</span>
            {formatOrganizationAddress(organization.address)}
          </Link>
        </Box>
      )}
    </TableCell>
  )
}
