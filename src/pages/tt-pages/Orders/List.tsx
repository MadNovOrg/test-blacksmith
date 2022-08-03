import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { differenceInDays, sub as subtractPeriod } from 'date-fns'
import { saveAs } from 'file-saver'
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { OrderType } from '@app/hooks/useOrders'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { xeroInvoiceStatusColors } from '@app/util'

type Props = {
  orders: OrderType[]
  sorting: Sorting
  loading: boolean
  filtered: boolean
}

export const List: React.FC<Props> = ({
  orders = [],
  sorting,
  loading,
  filtered,
}) => {
  const { t } = useTranslation()
  const { checkbox, selected, isSelected } = useTableChecks()

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.orders.cols-${col}`)
    return [
      checkbox.headCol(orders.map(o => o.id)),
      { id: 'id', label: _t('invoiceNumber'), sorting: true },
      { id: 'organization.name', label: _t('billTo'), sorting: true },
      { id: 'paymentMethod', label: _t('paymentMethod'), sorting: true },
      { id: 'orderTotal', label: _t('amount'), sorting: true },
      { id: 'orderDue', label: _t('due'), sorting: true },
      {
        id: 'course.schedule_aggregate.min.start',
        label: _t('dueDate'),
        sorting: true,
      },
      { id: 'status', label: _t('status') }, // TODO - add support for sorting when Xero is integrated with order creation
    ] as Col[]
  }, [t, orders, checkbox])

  const getOrderInfo = useCallback(order => {
    const { start } = order?.course?.schedule
      ? order.course.schedule[0]
      : { start: null }
    const { orderDue, status: orderStatus } = order
    const dueDate = subtractPeriod(new Date(start), { weeks: 8 })

    const status =
      differenceInDays(dueDate, new Date()) > 0
        ? ((orderStatus ?? 'UNKNOWN') as string)
        : 'OVERDUE'

    const [font, background] = xeroInvoiceStatusColors[status as string]

    return {
      due: orderDue,
      status,
      dueDate,
      statusColors: {
        font,
        background,
      },
    }
  }, [])

  const selectedOrders = useMemo(
    () => orders.filter(o => isSelected(o.id)),
    [orders, isSelected]
  )

  const exportOrders = useCallback(
    async (orders = []) => {
      const _t = (col: string) => t(`pages.orders.cols-${col}`)
      const ordersData = [
        [
          _t('invoiceNumber'),
          _t('billTo'),
          _t('paymentMethod'),
          _t('amount'),
          _t('due'),
          _t('dueDate'),
          _t('status'),
        ],
        ...orders.map((o: OrderType) => {
          const { due, status, dueDate } = getOrderInfo(o)

          return [
            o.id,
            o.organization?.name ?? '-NA-',
            t(`pages.orders.paymentMethod-${o.paymentMethod}`),
            o.orderTotal,
            due,
            dueDate,
            t(`filters.${status}`),
          ]
        }),
      ]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(ordersData)
      XLSX.utils.book_append_sheet(wb, ws, 'Orders')

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      saveAs(new Blob([buffer]), 'orders.xlsx')
    },
    [t, getOrderInfo]
  )

  return (
    <Box>
      <Grid justifyContent="end" alignItems="center" container sx={{ mb: 2 }}>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            disabled={selected.size === 0}
            onClick={() => exportOrders(selectedOrders)}
            data-testid="list-orders-export-selected-button"
          >
            {t('pages.orders.export-selected')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => exportOrders(orders)}
            data-testid="list-orders-export-all-button"
          >
            {t('pages.orders.export-whole-page')}
          </Button>
        </Stack>
      </Grid>

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
                  <CircularProgress
                    size={20}
                    data-testid="list-orders-circular-progress"
                  />
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
            const { due, status, dueDate, statusColors } = getOrderInfo(order)

            return (
              <TableRow
                key={order.id}
                style={{ height: '4.5rem' }}
                data-testid={order.id}
              >
                {checkbox.rowCell(order.id)}

                <TableCell>{order.id}</TableCell>

                <TableCell>{order.organization?.name ?? '-NA-'}</TableCell>

                <TableCell>
                  {t(`pages.orders.paymentMethod-${order.paymentMethod}`)}
                </TableCell>

                <TableCell>
                  {t('currency', {
                    amount: order.orderTotal,
                    currency: order.currency ?? 'GBP',
                  })}
                </TableCell>

                <TableCell>
                  {t('currency', {
                    amount: due,
                    currency: order.currency ?? 'GBP',
                  })}
                </TableCell>

                <TableCell>
                  <Typography
                    fontWeight="inherit"
                    fontSize="inherit"
                    color={status === 'OVERDUE' ? 'error.main' : ''}
                  >
                    {t('dates.default', { date: dueDate })}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{
                      color: statusColors.font,
                      backgroundColor: statusColors.background,
                      padding: '2px 8px',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  >
                    {t(`filters.${status}`)}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
