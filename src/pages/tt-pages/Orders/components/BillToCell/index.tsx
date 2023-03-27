import { Box, TableCell, Link } from '@mui/material'
import React from 'react'

import { OrderOrganizationInfoFragment } from '@app/generated/graphql'
import { Address } from '@app/types'

type Props = {
  organization?: OrderOrganizationInfoFragment
}

export const BillToCell: React.FC<Props> = ({ organization }) => {
  const formatOrganizationAddress = (address: Address) => {
    const { line1, line2, city, country, postCode } = address

    const formattedAddress = [line1, line2, city, country]
      .filter(Boolean)
      .join(', ')

    if (formattedAddress) {
      return (
        <span>
          {formattedAddress}
          {postCode ? (
            <>
              , <span style={{ whiteSpace: 'nowrap' }}>{postCode}</span>
            </>
          ) : null}
        </span>
      )
    } else {
      return null
    }
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
