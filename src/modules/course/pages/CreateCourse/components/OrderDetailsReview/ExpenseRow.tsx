import Big from 'big.js'
import { type FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Currency } from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies/useCurrencies'
import { ExpensesInput, TransportMethod } from '@app/types'
import {
  formatCurrency,
  getANZCarCost,
  getTrainerCarCostPerMile,
} from '@app/util'

import { useCreateCourse } from '../CreateCourseProvider'

import { PageRow } from './PageRow'

type TransportExpense = ExpensesInput['transport'][number]
type MiscellaneousExpense = NonNullable<ExpensesInput['miscellaneous']>[number]

type TransportExpenseRowProps = {
  expense: TransportExpense
  trainerName: string
  index: number
}

const TransportExpenseRow: FC<TransportExpenseRowProps> = ({
  expense,
  trainerName,
  index,
}) => {
  const { method, value, flightDays } = expense
  const { courseData } = useCreateCourse()
  const { defaultCurrency } = useCurrencies(courseData?.residingCountry)
  const currency = courseData?.priceCurrency ?? defaultCurrency
  const { t } = useTranslation()
  const { acl } = useAuth()

  const carCost = acl.isAustralia()
    ? getANZCarCost(value ?? 0, currency as Currency)
    : getTrainerCarCostPerMile(value)
  const amount = (method === TransportMethod.CAR ? carCost : value) ?? 0

  let caption: string | null = null
  switch (method) {
    case TransportMethod.CAR:
      caption = t(`pages.create-course.review-and-confirm.caption.${method}`, {
        count: value,
      })
      break
    case TransportMethod.FLIGHTS:
      caption = t(`pages.create-course.review-and-confirm.caption.${method}`, {
        count: flightDays,
      })
      break
    default:
      break
  }

  const label = t(`pages.create-course.trainer-expenses.${method}`)
  const formattedAmount = t('common.currency', {
    amount: new Big(amount).round().toNumber(),
    currency,
  })

  return (
    <PageRow
      label={label}
      value={formattedAmount}
      caption={caption}
      key={index}
      testId={`${trainerName}-trip-${index}`}
    />
  )
}

type MiscellaneousExpenseRowProps = {
  expense: MiscellaneousExpense
  trainerName: string
  index: number
}

const MiscellaneousExpenseRow: FC<MiscellaneousExpenseRowProps> = ({
  expense,
  trainerName,
  index,
}) => {
  const { name, value } = expense
  const { courseData } = useCreateCourse()
  const { defaultCurrency } = useCurrencies(courseData?.residingCountry)
  const currency = courseData?.priceCurrency ?? defaultCurrency
  const { t } = useTranslation()

  const formattedAmount = formatCurrency(
    {
      amount: value ?? 0,
      currency,
    },
    t,
  )

  return (
    <PageRow
      label={name}
      value={formattedAmount}
      key={index}
      testId={`${trainerName}-misc-${index}`}
    />
  )
}

type ExpenseRowProps = (
  | {
      expense: TransportExpense
      type: 'transport'
    }
  | {
      expense: MiscellaneousExpense
      type: 'miscellaneous'
    }
) & {
  index: number
  trainerName: string
}

export const ExpenseRow: FC<ExpenseRowProps> = ({
  expense,
  type,
  trainerName,
  index,
}) =>
  type === 'transport' ? (
    <TransportExpenseRow
      expense={expense}
      trainerName={trainerName}
      index={index}
    />
  ) : (
    <MiscellaneousExpenseRow
      expense={expense}
      trainerName={trainerName}
      index={index}
    />
  )
