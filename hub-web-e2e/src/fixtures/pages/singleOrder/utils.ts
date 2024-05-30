import { utcToZonedTime, format as tzFormat } from 'date-fns-tz'

import { CourseSchedule } from '@qa/data/types'

export function formatSchedule(schedule: CourseSchedule): string {
  const { start, end, timeZone } = schedule

  const startDate = utcToZonedTime(new Date(start), timeZone)
  const endDate = utcToZonedTime(new Date(end), timeZone)

  const formatStr = 'd MMMM yyyy, hh:mm aaa (OOOO)'
  const formattedStart = tzFormat(startDate, formatStr, { timeZone })
  const formattedEnd = tzFormat(endDate, formatStr, { timeZone })

  return `${formattedStart} - ${formattedEnd} ${timeZone}`
}

export function formatCourseTitle(courseId: number) {
  return `Level One (L1.F.OP-${courseId})`
}

export function formatDateForRegistrantSection(
  dateString: string,
  timeZone: string
): string {
  const date = new Date(dateString)
  const zonedDate = utcToZonedTime(date, timeZone)

  return tzFormat(zonedDate, 'dd-MMM-yyyy h:mm a', { timeZone })
}

export function formatCoursePrice(price: number) {
  return `£${price}.00`
}

export function formatInvoiceDate(invoiceDate: string, timeZone: string) {
  const date = new Date(invoiceDate)
  const zonedDate = utcToZonedTime(date, timeZone)

  return tzFormat(zonedDate, 'd MMMM yyyy', { timeZone })
}
