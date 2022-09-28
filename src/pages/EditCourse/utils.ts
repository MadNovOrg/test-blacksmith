import { differenceInDays } from 'date-fns'
import { isDate } from 'lodash-es'

export const getCancellationTermsFee = (
  courseStartDate: Date | string
): number => {
  const start = isDate(courseStartDate)
    ? courseStartDate
    : new Date(courseStartDate)
  const diff = differenceInDays(start, new Date())
  if (diff < 7) {
    return 100
  } else if (diff < 15) {
    return 75
  } else if (diff < 29) {
    return 50
  } else {
    return 25
  }
}
