import { Typography, Link } from '@mui/material'
import { FC } from 'react'

import { Course_Type_Enum } from '@app/generated/graphql'

import { getInvoice, CourseLogType } from '../utils/util'

export const Invoice: FC<{
  invoice: ReturnType<typeof getInvoice>
  log: CourseLogType
}> = ({ log, invoice }) => {
  if (!invoice) return null

  const isIndirect = log.course.type === Course_Type_Enum.Indirect
  const invoiceData = isIndirect
    ? log.course.orders.map(order => ({
        invoiceNumber: order.order?.xeroInvoiceNumber,
        orderId: order.order?.id,
      }))
    : [
        {
          invoiceNumber:
            log.xero_invoice_number ??
            log.course.orders[0].order?.xeroInvoiceNumber,
          orderId: invoice.order?.id,
        },
      ]

  return invoiceData.map(el => (
    <Link key={el.orderId} href={`/orders/${el.orderId}`}>
      <Typography variant="body2">{el.invoiceNumber}</Typography>
    </Link>
  ))
}
