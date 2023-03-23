import {
  Course_Type_Enum,
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
  if (
    log.course.type === Course_Type_Enum.Closed ||
    log.course.type === Course_Type_Enum.Indirect
  ) {
    if (log.course.orders.length > 0) {
      return log.course.orders[0]
    }
  }
  return null
}
export const getAttendeeInvoice = (log: AttendeeLogType) => {
  if (
    log.course.type === Course_Type_Enum.Closed ||
    log.course.type === Course_Type_Enum.Indirect
  ) {
    if (log.course.orders.length > 0) {
      return log.course.orders[0]
    }
  } else {
    return log.course.orders.find(
      order => order.registrants.indexOf(log.profile.email) > -1
    )
  }
  return null
}
