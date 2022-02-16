import { format } from 'date-fns'

export const noop = () => {
  // empty
}

export const formatDateRange = (dateFrom: Date, dateTo: Date): string => {
  if (!dateFrom || !dateTo) {
    return ``
  }
  const sameYear = dateFrom.getFullYear() === dateTo.getFullYear()
  const sameMonth = sameYear && dateFrom.getMonth() === dateTo.getMonth()
  const sameDay = sameMonth && dateFrom.getDate() === dateTo.getDate()
  if (sameDay) {
    return format(dateFrom, 'do LLLL')
  }
  if (sameMonth) {
    return `${format(dateFrom, 'do')}-${format(dateTo, 'do')} ${format(
      dateTo,
      'LLLL'
    )}`
  }
  if (sameYear) {
    return `${format(dateFrom, 'do LLLL')} - ${format(dateTo, 'do LLLL')}`
  }
  return `${format(dateFrom, 'do LLLL y')} - ${format(dateTo, 'do LLLL y')}`
}

export const formatDateForInput = (value: string | Date) => {
  return format(
    typeof value === 'string' ? new Date(value) : value,
    'yyyy-MM-dd'
  )
}

export const now = () => new Date()
