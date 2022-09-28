import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'
import { InvoiceDetails as InvoiceDetailsType } from '@app/types'

type Props = {
  details: InvoiceDetailsType
}

const ItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}))

export const InvoiceDetails: React.FC<Props> = ({ details }) => {
  const { t, _t } = useScopedTranslation('components.invoice-details')

  const infoRows: Record<string, string> = {
    [t('billing-address')]: details.billingAddress,
    [_t('first-name')]: details.firstName,
    [_t('surname')]: details.surname,
    [_t('email')]: details.email,
    [_t('phone')]: details.phone,
    'Purchase order': details.purchaseOrder,
  }

  return (
    <>
      <Typography variant="h6" mb={2}>
        {t('title')}
      </Typography>
      {Object.keys(infoRows).map(rowKey =>
        infoRows[rowKey] ? (
          <ItemRow key={rowKey}>
            <Typography color={theme.palette.grey[600]}>{rowKey}</Typography>
            <Typography>{infoRows[rowKey]}</Typography>
          </ItemRow>
        ) : null
      )}
    </>
  )
}
