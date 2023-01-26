import { sub, differenceInWeeks } from 'date-fns'

import { PaymentMethod, Payment_Methods_Enum } from '@app/generated/graphql'

export const isOrderDueDateImmediate = (
  creationDate: Date,
  startDate: Date,
  paymentMethod?: PaymentMethod | Payment_Methods_Enum
): boolean => {
  const isCreditCard = paymentMethod === PaymentMethod.Cc
  return isCreditCard || differenceInWeeks(startDate, creationDate) < 8
}

export const getOrderDueDate = (
  creationDateString: string | Date,
  startDateString: string | Date,
  paymentMethod?: PaymentMethod | Payment_Methods_Enum
): Date => {
  const creationDate = new Date(creationDateString)
  const startDate = new Date(startDateString)

  if (isOrderDueDateImmediate(creationDate, startDate, paymentMethod)) {
    return creationDate
  }

  return sub(startDate, { weeks: 8 })
}
