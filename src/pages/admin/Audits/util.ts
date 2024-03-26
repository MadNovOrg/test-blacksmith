import {
  GetAttendeeAuditLogsQuery,
  GetCourseAuditLogsQuery,
} from '@app/generated/graphql'

export const getExportDataRenderFunction = <T>(
  cols: { label: string; exportRender: (o: T) => string }[],
  logs: T[]
) => {
  return () => {
    return [
      cols.map(c => c.label),
      ...logs.map(row => cols.map(col => col.exportRender(row))),
    ]
  }
}

export type CourseLogType = GetCourseAuditLogsQuery['logs'][0]
export type AttendeeLogType = GetAttendeeAuditLogsQuery['logs'][0]

export const getCourseInvoice = (log: CourseLogType) => {
  if (!log.course.orders || log.course.orders.length === 0) {
    return null
  }
  if (log.xero_invoice_number) {
    return log.course?.orders?.find(
      o => o.order?.xeroInvoiceNumber === log.xero_invoice_number
    )
  } else {
    return log.course?.orders[0]
  }
}
export const getAttendeeInvoice = (log: AttendeeLogType) => {
  if (!log.course.orders || log.course.orders.length === 0) {
    return null
  }
  if (log.xero_invoice_number) {
    return log.course?.orders?.find(
      o => o.order?.xeroInvoiceNumber === log.xero_invoice_number
    )
  } else {
    return log.course?.orders[0]
  }
}
