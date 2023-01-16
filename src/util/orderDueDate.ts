import { add, differenceInWeeks } from 'date-fns'

export const getOrderDueDate = (
  creationDateString: string,
  startDateString: string
): Date => {
  const creationDate = new Date(creationDateString)
  const startDate = new Date(startDateString)

  if (differenceInWeeks(startDate, creationDate) < 8) {
    return creationDate
  }

  return add(startDate, { weeks: 8 })
}
