import Big from 'big.js'

import { Currency } from '@app/generated/graphql'
import { ExpensesInput, TransportMethod } from '@app/types'
import { getANZCarCost, getTrainerSubsistenceCost } from '@app/util'

export const getTrainerExpensesTotal = (
  expenses: Record<string, ExpensesInput>,
  currency: Currency,
) => {
  if (!expenses) {
    return 0
  }

  let result = 0

  for (const expense of Object.values(expenses)) {
    const transportCost = expense.transport.reduce(
      (acc, { method, value, accommodationCost, accommodationNights }) => {
        const cost =
          (method === TransportMethod.CAR
            ? getANZCarCost(value ?? 0, currency)
            : value) ?? 0
        const subsistenceCost =
          Number((accommodationNights ?? 0) > 0) &&
          getTrainerSubsistenceCost(accommodationNights, false)

        return new Big(acc)
          .add(cost)
          .add(
            accommodationCost && accommodationNights
              ? accommodationCost * accommodationNights
              : 0,
          )
          .add(subsistenceCost)
          .round()
          .toNumber()
      },
      0,
    )

    const miscellaneousCost =
      expense.miscellaneous?.reduce(
        (acc, { value }) =>
          new Big(acc)
            .add(value ?? 0)
            .round()
            .toNumber(),
        0,
      ) ?? 0

    result += transportCost + miscellaneousCost
  }

  return result
}
