import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Chip,
} from '@mui/material'
import { saveAs } from 'file-saver'
import { t } from 'i18next'
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { OrderInfo, XeroInvoiceStatus } from '@app/generated/graphql'
import { Maybe, OrganizationInfo } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { getOrderDueDate, INVOICE_STATUS_COLOR } from '@app/util'

import { BillToCell } from './components/BillToCell'

const formatBillToForExcel = (organization?: Maybe<OrganizationInfo>) => {
  if (organization && organization.name) {
    let address
    if (organization.address) {
      const { line1, line2, city, country, postCode } = organization.address

      address = [line1, line2, city, country, postCode]
        .filter(Boolean)
        .join(', ')
    }
    return `${organization?.name}${address ? ', ' + address : ''}`
  } else {
    return t('pages.orders.no-organisation')
  }
}

type Props = {
  orders: OrderInfo[]
  sorting: Sorting
  loading: boolean
  filtered: boolean
}

export const List: React.FC<React.PropsWithChildren<Props>> = ({
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
      { id: 'xeroInvoiceNumber', label: _t('invoiceNumber'), sorting: true },
      {
        id: 'xeroReference',
        label: _t('xeroReference'),
        sorting: true,
      },
      { id: 'organization.name', label: _t('billTo'), sorting: true },
      { id: 'paymentMethod', label: _t('paymentMethod'), sorting: true },
      { id: 'orderTotal', label: _t('amount'), sorting: true },
      { id: 'orderDue', label: _t('due'), sorting: true },
      {
        id: 'course.schedule_aggregate.min.start',
        label: _t('dueDate'),
        sorting: true,
      },
      { id: 'status', label: _t('status'), sorting: true },
    ] as Col[]
  }, [t, orders, checkbox])

  const getOrderInfo = useCallback((order: OrderInfo) => {
    const { orderDue, status, course, createdAt } = order
    const { date: startDate } = course.dates.aggregate.start

    const dueDate = getOrderDueDate(
      createdAt,
      startDate,
      order.paymentMethod || undefined
    )

    return {
      due: orderDue,
      status,
      dueDate,
    }
  }, [])

  const selectedOrders = useMemo(
    () => orders.filter(o => isSelected(o.id)),
    [orders, isSelected]
  )

  const exportOrders = useCallback(
    async (orders: OrderInfo[] = []) => {
      const _t = (col: string) => t(`pages.orders.cols-${col}`)
      const ordersData = [
        [
          _t('invoiceNumber'),
          _t('xeroReference'),
          _t('billTo'),
          _t('paymentMethod'),
          _t('amount'),
          _t('due'),
          _t('dueDate'),
          _t('status'),
        ],
        ...orders.map((o: OrderInfo) => {
          const { due, status, dueDate } = getOrderInfo(o)

          return [
            o.xeroInvoiceNumber,
            o.xeroReference,
            formatBillToForExcel(o.organization),
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
            const { due, status, dueDate } = getOrderInfo(order)

            return (
              <TableRow
                key={order.id}
                style={{ height: '4.5rem' }}
                data-testid={order.id}
              >
                {checkbox.rowCell(order.id)}

                <TableCell>
                  {order.status !== XeroInvoiceStatus.Unknown ? (
                    <Link href={order.id}>{order.xeroInvoiceNumber}</Link>
                  ) : (
                    order.xeroInvoiceNumber
                  )}
                </TableCell>

                <TableCell>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {order.xeroReference}
                  </span>
                </TableCell>

                <BillToCell organization={order.organization} />

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
                  <Chip
                    label={t(`filters.${status}`)}
                    color={INVOICE_STATUS_COLOR[status as XeroInvoiceStatus]}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
