import { Box, Grid, Stack, Typography } from '@mui/material'
import Big from 'big.js'
import { parseISO } from 'date-fns'
import React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { InvoiceDetails } from '@app/components/InvoiceDetails'
import theme from '@app/theme'
import { ExpensesInput, TransportMethod } from '@app/types'
import {
  getTimeDifferenceAndContext,
  getTrainerCarCostPerMile,
  getTrainerSubsistenceCost,
  getVatAmount,
} from '@app/util'

import { useCreateCourse } from '../CreateCourseProvider'

const mainColor = theme.typography.body1.color
const secondaryColor = theme.typography.body2.color

type TransportExpense = ExpensesInput['transport'][number]
type MiscellaneousExpense = NonNullable<ExpensesInput['miscellaneous']>[number]

type PageRowProps = {
  caption?: string | null
  isBold?: boolean
  label?: string | null
  mt?: number
  value?: string | null
  testId?: string
}

const PageRow: React.FC<React.PropsWithChildren<PageRowProps>> = ({
  caption,
  isBold,
  label,
  mt = 0,
  value,
  testId,
}) => (
  <Grid container spacing={0} mt={mt} data-testid={testId}>
    <Grid item xs={8}>
      <Typography
        color={isBold ? mainColor : secondaryColor}
        fontWeight={isBold ? 600 : 400}
      >
        {label}
      </Typography>
    </Grid>

    <Grid item xs={4}>
      <Typography fontWeight={isBold ? 600 : 400} textAlign="right">
        {value}
      </Typography>
    </Grid>

    {caption ? (
      <Grid item xs={8}>
        <Typography variant="caption" color={secondaryColor}>
          {caption}
        </Typography>
      </Grid>
    ) : null}
  </Grid>
)

type ExpensesDetailsProps = {
  expenses: ExpensesInput
  trainerName: string
}

const ExpensesDetails: React.FC<ExpensesDetailsProps> = ({
  expenses,
  trainerName,
}) => {
  const { t } = useTranslation()

  const getRowForTransportExpense = useCallback(
    (e: TransportExpense, key: number) => {
      const { method, value, flightDays } = e
      const amount =
        (method === TransportMethod.CAR
          ? getTrainerCarCostPerMile(value)
          : value) ?? 0

      let caption: string | null = null
      switch (method) {
        case TransportMethod.CAR:
          caption = t(
            `pages.create-course.review-and-confirm.caption.${method}`,
            { count: value }
          )
          break
        case TransportMethod.FLIGHTS:
          caption = t(
            `pages.create-course.review-and-confirm.caption.${method}`,
            { count: flightDays }
          )
          break
        default:
          break
      }

      const label = t(`pages.create-course.trainer-expenses.${method}`)
      const formattedAmount = t('common.currency', {
        amount: new Big(amount).round().toNumber(),
      })

      return (
        <PageRow
          label={label}
          value={formattedAmount}
          caption={caption}
          key={key}
          testId={`${trainerName}-trip-${key}`}
        />
      )
    },
    [t, trainerName]
  )

  const getRowForMiscellaneousExpense = useCallback(
    (e: MiscellaneousExpense, key: number) => {
      const { name, value } = e

      const formattedAmount = t('common.currency', { amount: value })

      return (
        <PageRow
          label={name}
          value={formattedAmount}
          key={key}
          testId={`${trainerName}-misc-${key}`}
        />
      )
    },
    [t, trainerName]
  )

  const getRowForExpense = useCallback(
    (
      e: TransportExpense | MiscellaneousExpense,
      type: keyof ExpensesInput,
      key: number
    ) =>
      type === 'transport'
        ? getRowForTransportExpense(e as TransportExpense, key)
        : getRowForMiscellaneousExpense(e as MiscellaneousExpense, key),
    [getRowForTransportExpense, getRowForMiscellaneousExpense]
  )

  const accommodationRow = useMemo(() => {
    const accommodationNights =
      expenses.transport.reduce(
        (acc, { accommodationNights: n }) => (n && n > 0 ? acc + n : acc),
        0
      ) ?? 0

    const accommodationCost =
      expenses.transport.reduce(
        (acc, { accommodationCost: c, accommodationNights: n }) =>
          n && c && n > 0 ? acc + n * c : acc,
        0
      ) ?? 0

    const aLabel = t('pages.create-course.trainer-expenses.accommodation')
    const aFormattedAmount = t('common.currency', {
      amount: accommodationCost,
    })

    const sLabel = t('pages.create-course.trainer-expenses.subsistence')
    const sFormattedAmount = t('common.currency', {
      amount: getTrainerSubsistenceCost(accommodationNights),
    })
    const sCaption = t(
      'pages.create-course.review-and-confirm.caption.accommodation',
      { count: accommodationNights }
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
  }, [t, expenses.transport, trainerName])

  return (
    <Box data-testid={`${trainerName}-trainer-expenses`}>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {trainerName}
      </Typography>

      <Stack spacing={1}>
        {expenses.transport
          ?.filter(({ method }) => method !== TransportMethod.NONE)
          .map((e, idx) => getRowForExpense(e, 'transport', idx))}
        {accommodationRow}
        {expenses.miscellaneous?.map((e, idx) =>
          getRowForExpense(e, 'miscellaneous', idx)
        )}
      </Stack>
    </Box>
  )
}

export const OrderDetailsReview: React.FC = () => {
  const {
    courseData,
    courseName,
    trainers,
    expenses,
    pricing,
    invoiceDetails,
  } = useCreateCourse()

  const { startDate, endDate } = useMemo(
    () =>
      courseData
        ? {
            startDate:
              typeof courseData.startDateTime === 'string'
                ? parseISO(courseData.startDateTime)
                : courseData.startDateTime,
            endDate:
              typeof courseData.endDateTime === 'string'
                ? parseISO(courseData.endDateTime)
                : courseData.endDateTime,
          }
        : {},
    [courseData]
  )

  const courseDuration = useMemo(() => {
    if (!startDate || !endDate) {
      return ''
    }

    const tdc = getTimeDifferenceAndContext(endDate, startDate)
    return `${tdc.count} ${tdc.context}`
  }, [endDate, startDate])

  const trainerExpensesTotal = useMemo(() => {
    if (!expenses) {
      return 0
    }

    let result = 0

    for (const expense of Object.values(expenses)) {
      const transportCost = expense.transport.reduce(
        (acc, { method, value, accommodationCost, accommodationNights }) => {
          const cost =
            (method === TransportMethod.CAR
              ? getTrainerCarCostPerMile(value)
              : value) ?? 0
          const subsistenceCost =
            (accommodationNights ?? 0) > 0
              ? getTrainerSubsistenceCost(accommodationNights)
              : 0

          return new Big(acc)
            .add(cost)
            .add(
              accommodationCost && accommodationNights
                ? accommodationCost * accommodationNights
                : 0
            )
            .add(subsistenceCost)
            .round()
            .toNumber()
        },
        0
      )

      const miscellaneousCost =
        expense.miscellaneous?.reduce(
          (acc, { value }) =>
            new Big(acc)
              .add(value ?? 0)
              .round()
              .toNumber(),
          0
        ) ?? 0

      result += transportCost + miscellaneousCost
    }

    return result
  }, [expenses])

  const [courseBasePrice, subtotal, freeSpacesDiscount, vat, amountDue] =
    useMemo(() => {
      if (!courseData || !pricing.amount) {
        return []
      }

      const courseBasePrice = new Big(pricing.amount).times(
        courseData.maxParticipants
      )

      const freeSpacesDiscount = new Big(pricing.amount)
        .times(courseData.freeSpaces ?? 0)
        .neg()

      const subtotal = courseBasePrice
        .add(freeSpacesDiscount)
        .add(trainerExpensesTotal)

      const vat = new Big(getVatAmount(subtotal.toNumber()))
      const amountDue = subtotal.add(vat)

      return [
        courseBasePrice.round().toNumber(),
        subtotal.round().toNumber(),
        freeSpacesDiscount.round().toNumber(),
        vat.round().toNumber(),
        amountDue.round().toNumber(),
      ]
    }, [courseData, trainerExpensesTotal, pricing])

  const { t } = useTranslation()
  return (
    <Stack spacing="2px">
      <InfoPanel data-testid="course-info">
        <Typography
          variant="h6"
          fontWeight={600}
          component="h6"
          mb={1}
          data-testid="course-title-duration"
        >
          {courseName} - {courseDuration}
        </Typography>

        <Typography color="dimGrey.main" data-testid="course-dates">
          {t('dates.withTime', { date: startDate })} -{' '}
          {t('dates.withTime', { date: endDate })}
        </Typography>
      </InfoPanel>

      <InfoPanel>
        <Stack spacing={1}>
          <PageRow
            label={t(
              'pages.create-course.review-and-confirm.sales-representative'
            )}
            value={courseData?.salesRepresentative?.fullName}
            testId="sales-row"
          />
          <PageRow
            label={t('pages.create-course.review-and-confirm.account-code')}
            value={courseData?.accountCode}
            testId="account-code-row"
          />
        </Stack>
      </InfoPanel>

      {invoiceDetails ? (
        <>
          <InfoPanel title={t('common.payment-method')}>
            <InfoRow label={t('common.pay-by-inv')}></InfoRow>
          </InfoPanel>
          <InfoPanel>
            <InvoiceDetails details={invoiceDetails} />
          </InfoPanel>
        </>
      ) : null}

      {trainers?.map(trainer => (
        <InfoPanel
          key={trainer.profile_id}
          data-testid={`trainer-${trainer.profile_id}-row`}
        >
          {expenses && expenses[trainer.profile_id] ? (
            <ExpensesDetails
              expenses={expenses[trainer.profile_id]}
              trainerName={trainer.fullName ?? ''}
            />
          ) : (
            <PageRow
              label={t('pages.create-course.review-and-confirm.no-travels')}
            />
          )}
        </InfoPanel>
      ))}

      <InfoPanel>
        <PageRow
          label={t(
            'pages.create-course.review-and-confirm.trainer-expenses-total'
          )}
          value={t('common.currency', { amount: trainerExpensesTotal })}
          testId="trainer-total-expenses"
        />
      </InfoPanel>

      <InfoPanel>
        <PageRow
          label={t('pages.create-course.review-and-confirm.base-price')}
          value={t('common.currency', { amount: courseBasePrice })}
          testId="course-price-row"
        />
      </InfoPanel>

      <InfoPanel>
        <Stack spacing={1}>
          <PageRow
            label={t('pages.create-course.review-and-confirm.free-spaces', {
              count: courseData?.freeSpaces,
            })}
            value={t('common.currency', { amount: freeSpacesDiscount })}
            testId="free-spaces-row"
          />

          <PageRow
            label={t('pages.create-course.review-and-confirm.subtotal')}
            value={t('common.currency', { amount: subtotal })}
            testId="subtotal-row"
          />

          <PageRow
            label={t('pages.create-course.review-and-confirm.vat')}
            value={t('common.currency', { amount: vat })}
            testId="vat-row"
          />
        </Stack>
      </InfoPanel>

      <InfoPanel>
        <PageRow
          isBold={true}
          label={t('pages.create-course.review-and-confirm.amount-due')}
          value={t('common.currency', { amount: amountDue })}
          testId="total-costs-row"
        />
      </InfoPanel>
    </Stack>
  )
}
