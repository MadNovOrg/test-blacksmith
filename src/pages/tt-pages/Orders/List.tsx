import {
  Box,
  Button,
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
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import {
  OrderInfoFragment,
  OrderOrganizationInfoFragment,
  Xero_Invoice_Status_Enum,
} from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { INVOICE_STATUS_COLOR } from '@app/util'

const formatBillToForExcel = (organization?: OrderOrganizationInfoFragment) => {
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
  orders: OrderInfoFragment[]
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
        id: 'invoice.reference',
        label: _t('xeroReference'),
        sorting: true,
      },
      { id: 'organization.name', label: _t('billTo'), sorting: true },
      { id: 'paymentMethod', label: _t('paymentMethod'), sorting: true },
      { id: 'invoice.total', label: _t('amount'), sorting: true },
      { id: 'invoice.amountDue', label: _t('due'), sorting: true },
      {
        id: 'invoice.dueDate',
        label: _t('dueDate'),
        sorting: true,
      },
      { id: 'invoice.status', label: _t('status'), sorting: true },
    ] as Col[]
  }, [t, orders, checkbox])

  const selectedOrders = useMemo(
    () => orders.filter(o => isSelected(o.id)),
    [orders, isSelected],
  )

  const exportOrders = useCallback(
    async (orders: OrderInfoFragment[] = []) => {
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
        ...orders.map(o => {
          const { orderDue } = o
          const { status, dueDate, reference } = o.invoice ?? {}

          return [
            o.xeroInvoiceNumber,
            reference,
            formatBillToForExcel(o.organization),
            t(`pages.orders.paymentMethod-${o.paymentMethod}`),
            o.orderTotal,
            orderDue,
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
    [t],
  )

  return (
    <Box>
      <Helmet>
        <title>{t('pages.browser-tab-titles.orders.title')}</title>
      </Helmet>
      <Stack
        direction="row"
        gap={2}
        mb={3}
        justifyContent="end"
        alignItems="center"
      >
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
            const references = order.courses
              ? order.courses
                  .map(data => data.course?.course_code)
                  .filter(reference => Boolean(reference))
              : []

            const { status, dueDate } = order.invoice ?? {}

            return (
              <TableRow
                key={order.id}
                style={{ height: '4.5rem' }}
                data-testid={order.id}
              >
                {checkbox.rowCell(order.id)}

                <TableCell>
                  {order.invoice ? (
                    <Link href={order.id}>{order.xeroInvoiceNumber}</Link>
                  ) : (
                    order.xeroInvoiceNumber
                  )}
                </TableCell>

                <TableCell>
                  {references.map((code, i) => (
                    <>
                      <span key={code} style={{ whiteSpace: 'nowrap' }}>
                        {code}
                      </span>
                      {i === references.length - 1 ? null : <br />}
                    </>
                  ))}
                </TableCell>

                <TableCell>
                  {order.organization && (
                    <Link href={`/organisations/${order.organization.id}`}>
                      {order.organization.name}
                    </Link>
                  )}
                </TableCell>

                <TableCell>
                  {t(`pages.orders.paymentMethod-${order.paymentMethod}`)}
                </TableCell>

                <TableCell>
                  {t('currency', {
                    amount: order.invoice?.total,
                    currency: order.currency ?? 'GBP',
                  })}
                </TableCell>

                <TableCell>
                  {t('currency', {
                    amount: order.invoice?.amountDue,
                    currency: order.currency ?? 'GBP',
                  })}
                </TableCell>

                <TableCell>
                  {dueDate && (
                    <Typography
                      fontWeight="inherit"
                      fontSize="inherit"
                      color={
                        status === Xero_Invoice_Status_Enum.Overdue
                          ? 'error.main'
                          : ''
                      }
                    >
                      {t('dates.default', { date: dueDate })}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={t(`filters.${status}`)}
                    color={
                      INVOICE_STATUS_COLOR[status as Xero_Invoice_Status_Enum]
                    }
                    size="small"
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
