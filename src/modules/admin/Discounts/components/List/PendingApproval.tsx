import { Box, Table, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import { Col, TableHead } from '@app/components/Table/TableHead'
import { GetPromoCodesPendingApprovalQuery } from '@app/generated/graphql'
import { GET_PROMOCODES_PENDING_APPROVAL } from '@app/queries/promo-codes/get-pending-approval'

import { Row } from './Row'

type PromoCode = GetPromoCodesPendingApprovalQuery['promoCodes'][0]

type Props = { onAction: () => Promise<unknown> | void }

export const PendingApproval: React.FC<React.PropsWithChildren<Props>> = ({
  onAction,
}) => {
  const { t } = useTranslation()

  const [{ data }] = useQuery<GetPromoCodesPendingApprovalQuery>({
    query: GET_PROMOCODES_PENDING_APPROVAL,
  })
  const pendingApproval = data?.promoCodes ?? []

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.promoCodes.cols-${col}`)
    return [
      { id: 'code', label: _t('code') },
      { id: 'type', label: _t('type'), align: 'center' },
      { id: 'appliesTo', label: _t('appliesTo') },
      { id: 'start', label: _t('start') },
      { id: 'end', label: _t('end') },
      { id: 'createdBy', label: _t('createdBy') },
      { id: 'status', label: _t('actions') },
    ] as Col[]
  }, [t])

  if (pendingApproval.length === 0) {
    return (
      <Typography variant="body2" mb={4}>
        {t('pages.promoCodes.none-pending')}
      </Typography>
    )
  }

  return (
    <Box
      mb={4}
      sx={{
        border: 6,
        borderTop: 0,
        borderColor: 'grey.100',
        borderRadius: 2,
      }}
    >
      <Table>
        <TableHead cols={cols} />

        {pendingApproval.map((p: PromoCode) => (
          <Row key={p.id} promo={p} showApprove={true} onAction={onAction} />
        ))}
      </Table>
    </Box>
  )
}
