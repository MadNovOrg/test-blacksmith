import { differenceInDays } from 'date-fns'

export const getTransferTermsFee = (startDate: Date): number => {
  const diff = differenceInDays(startDate, new Date())
  if (diff < 14) {
    return 25
  } else if (diff < 29) {
    return 15
  } else {
    return 0
  }
}
