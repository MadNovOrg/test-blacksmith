import { Box, Stack, Typography } from '@mui/material'
import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { defaultCurrency } from '@app/components/CurrencySelector'
import { ExpensesInput, TransportMethod } from '@app/types'
import { getTrainerSubsistenceCost } from '@app/util'

import { useCreateCourse } from '../CreateCourseProvider'

import { ExpenseRow } from './ExpenseRow'
import { PageRow } from './PageRow'

type ExpensesDetailsProps = {
  expenses: ExpensesInput
  trainerName: string
}

export const ExpensesDetails: FC<ExpensesDetailsProps> = ({
  expenses,
  trainerName,
}) => {
  const { t } = useTranslation()
  const { isUKCountry } = useWorldCountries()
  const { courseData } = useCreateCourse()
  const currency = courseData?.priceCurrency ?? defaultCurrency

  const accommodationRow = useMemo(() => {
    const accommodationNights =
      expenses.transport.reduce(
        (acc, { accommodationNights: n }) => (n && n > 0 ? acc + n : acc),
        0,
      ) ?? 0

    const accommodationCost =
      expenses.transport.reduce(
        (acc, { accommodationCost: c, accommodationNights: n }) =>
          n && c && n > 0 ? acc + n * c : acc,
        0,
      ) ?? 0

    const aLabel = t('pages.create-course.trainer-expenses.accommodation')
    const aFormattedAmount = t('common.currency', {
      amount: accommodationCost,
      currency,
    })

    const sLabel = t('pages.create-course.trainer-expenses.subsistence')
    const sFormattedAmount = t('common.currency', {
      amount: getTrainerSubsistenceCost(
        accommodationNights,
        isUKCountry(courseData?.residingCountry),
      ),
      currency,
    })
    const sCaption = t(
      'pages.create-course.review-and-confirm.caption.accommodation',
      { count: accommodationNights },
    )

    return (
      <>
        <PageRow
          label={aLabel}
          value={aFormattedAmount}
          testId={`${trainerName}-accommodation-costs`}
        />
        <PageRow
          label={sLabel}
          value={sFormattedAmount}
          caption={sCaption}
          testId={`${trainerName}-accommodation-nights`}
        />
      </>
    )
  }, [
    t,
    expenses.transport,
    trainerName,
    currency,
    courseData?.residingCountry,
    isUKCountry,
  ])

  return (
    <Box data-testid={`${trainerName}-trainer-expenses`}>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {trainerName}
      </Typography>

      <Stack spacing={1}>
        {expenses.transport
          ?.filter(({ method }) => method !== TransportMethod.NONE)
          .map((e, idx) => (
            <ExpenseRow
              expense={e}
              index={idx}
              key={idx}
              type={'transport'}
              trainerName={trainerName}
            />
          ))}
        {accommodationRow}
        {expenses.miscellaneous?.map((e, idx) => (
          <ExpenseRow
            expense={e}
            index={idx}
            key={idx}
            type={'miscellaneous'}
            trainerName={trainerName}
          />
        ))}
      </Stack>
    </Box>
  )
}
