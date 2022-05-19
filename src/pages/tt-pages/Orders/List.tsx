import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { Order } from '@app/types'

type Props = {
  orders: Array<Partial<Order> & { id: Order['id'] }>
  sorting: Sorting
  loading: boolean
  filtered: boolean
}

export const List: React.FC<Props> = ({
  orders,
  sorting,
  loading,
  filtered,
}) => {
  const { t } = useTranslation()
  const { checkbox } = useTableChecks()

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.orders.cols-${col}`)
    return [
      checkbox.headCol(orders.map(o => o.id)),
      { id: 'createdAt', label: _t('createdAt'), sorting: true },
      { id: 'organization', label: _t('organization') },
      { id: 'course', label: _t('course') },
      {
        id: 'orderTotal',
        label: _t('orderTotal'),
        sorting: true,
        align: 'center',
      },
      {
        id: 'paymentMethod',
        label: _t('paymentMethod'),
        align: 'center',
      },
    ] as Col[]
  }, [t, orders, checkbox])

  return (
    <Table>
      <TableHead
        cols={cols}
        orderBy={sorting.by}
        order={sorting.dir}
        onRequestSort={sorting.onSort}
      />
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={cols.length}>
              <Stack direction="row" alignItems="center">
                <CircularProgress size={20} />
              </Stack>
            </TableCell>
          </TableRow>
        ) : null}

        <TableNoRows
          noRecords={!loading && !orders.length}
          filtered={filtered}
          itemsName={t('orders').toLowerCase()}
          colSpan={cols.length}
        />

        {orders.map(order => {
          return (
            <TableRow key={order.id}>
              {checkbox.rowCell(order.id)}

              <TableCell>
                {t('dates.default', { date: order.createdAt })}
                <Box sx={{ fontSize: '.9em' }}>
                  {t('dates.time', { date: order.createdAt })}
                </Box>
              </TableCell>

              <TableCell>{order.organization?.name ?? '-NA-'}</TableCell>

              <TableCell>
                {order.course?.name ?? '-NA-'}
                <Typography variant="body2" sx={{ fontSize: '.9em' }}>
                  {t('pages.orders.qty')}: {order.quantity}
                </Typography>
              </TableCell>

              <TableCell align="right">
                {t('currency', { amount: order.orderTotal })}
              </TableCell>

              <TableCell align="center">
                {t(`pages.orders.paymentMethod-${order.paymentMethod}`)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
