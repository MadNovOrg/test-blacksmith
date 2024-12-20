import { Currency, Course_Expenses_Insert_Input } from '@app/generated/graphql'
import { ExpensesInput, CourseExpenseType, TransportMethod } from '@app/types'
import { getMandatoryCourseMaterialsCost } from '@app/util'

export const prepareExpensesDataUK = (
  expenses: Record<string, ExpensesInput>,
  mandatoryCourseMaterialsCostEnabled: boolean,
  freeCourseMaterials: number,
  maxParticipants: number,
  currency: Currency,
): Array<Course_Expenses_Insert_Input> => {
  const courseExpenses: Array<Course_Expenses_Insert_Input> = []

  if (mandatoryCourseMaterialsCostEnabled) {
    courseExpenses.push({
      data: {
        type: CourseExpenseType.Materials,
        cost: getMandatoryCourseMaterialsCost(
          maxParticipants - freeCourseMaterials,
          currency,
        ),
      },
    })
  }

  for (const trainerId of Object.keys(expenses)) {
    const { transport, miscellaneous } = expenses[trainerId]

    let accommodationNightsTotal = 0
    let accommodationCostTotal = 0

    transport
      .filter(t => t.method !== TransportMethod.NONE)
      .forEach(
        ({
          method,
          value,
          accommodationCost,
          accommodationNights,
          flightDays,
        }) => {
          if (accommodationNights && accommodationNights > 0) {
            accommodationNightsTotal += accommodationNights ?? 0
            accommodationCostTotal +=
              accommodationNights * (accommodationCost ?? 0)
          }

          const expense: Course_Expenses_Insert_Input = {
            trainerId,
            data: {
              type: CourseExpenseType.Transport,
              method,
            },
          }

          if (method === TransportMethod.CAR) {
            expense.data.mileage = value
          } else {
            expense.data.cost = value

            if (method === TransportMethod.FLIGHTS) {
              expense.data.flightDays = flightDays
            }
          }

          courseExpenses.push(expense)
        },
      )

    if (accommodationNightsTotal > 0) {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Accommodation,
          accommodationCost: accommodationCostTotal,
          accommodationNights: accommodationNightsTotal,
        },
      })
    }

    miscellaneous?.forEach(({ name, value }) => {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Miscellaneous,
          description: name as string,
          cost: value as number,
        },
      })
    })
  }

  return courseExpenses
}

export const prepareExpensesDataANZ = (
  expenses: Record<string, ExpensesInput>,
  mandatoryCourseMaterialsCostEnabled: boolean,
  freeCourseMaterials: number,
  maxParticipants: number,
  currency: Currency,
  cost: number,
): Array<Course_Expenses_Insert_Input> => {
  const courseExpenses: Array<Course_Expenses_Insert_Input> = []

  if (mandatoryCourseMaterialsCostEnabled) {
    courseExpenses.push({
      data: {
        type: CourseExpenseType.Materials,
        cost: (maxParticipants - freeCourseMaterials) * cost,
      },
    })
  }

  for (const trainerId of Object.keys(expenses)) {
    const { transport, miscellaneous } = expenses[trainerId]

    let accommodationNightsTotal = 0
    let accommodationCostTotal = 0

    transport
      .filter(t => t.method !== TransportMethod.NONE)
      .forEach(
        ({
          method,
          value,
          accommodationCost,
          accommodationNights,
          flightDays,
        }) => {
          if (accommodationNights && accommodationNights > 0) {
            accommodationNightsTotal += accommodationNights ?? 0
            accommodationCostTotal +=
              accommodationNights * (accommodationCost ?? 0)
          }

          const expense: Course_Expenses_Insert_Input = {
            trainerId,
            data: {
              type: CourseExpenseType.Transport,
              method,
            },
          }

          if (method === TransportMethod.CAR) {
            expense.data.mileage = value
          } else {
            expense.data.cost = value

            if (method === TransportMethod.FLIGHTS) {
              expense.data.flightDays = flightDays
            }
          }

          courseExpenses.push(expense)
        },
      )

    if (accommodationNightsTotal > 0) {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Accommodation,
          accommodationCost: accommodationCostTotal,
          accommodationNights: accommodationNightsTotal,
        },
      })
    }

    miscellaneous?.forEach(({ name, value }) => {
      courseExpenses.push({
        trainerId,
        data: {
          type: CourseExpenseType.Miscellaneous,
          description: name as string,
          cost: value as number,
        },
      })
    })
  }

  return courseExpenses
}
