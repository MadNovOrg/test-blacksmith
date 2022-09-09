import { Alert, Box, Grid, Stack, Typography } from '@mui/material'
import { parseISO } from 'date-fns'
import React, { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import {
  QUERY as GET_COURSE_PRICING,
  ResponseType as GetCoursePricingResponseType,
} from '@app/queries/courses/get-course-pricing-no-id'
import theme from '@app/theme'
import { ExpensesInput, TransportMethod } from '@app/types'
import {
  generateCourseName,
  getSWRLoadingStatus,
  getTimeDifferenceAndContext,
  getTrainerCarCostPerMile,
  getTrainerAccommodationCost,
  getVatAmount,
  LoadingStatus,
  roundToTwoDecimals,
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
  value?: string | null
  testId?: string
}

const PageRow: React.FC<PageRowProps> = ({
  caption,
  isBold,
  label,
  value,
  testId,
}) => (
  <Grid container spacing={0} mt={4} data-testid={testId}>
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
      const formattedAmount = t('common.currency', { amount })

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

      return <PageRow label={name} value={formattedAmount} key={key} />
    },
    [t]
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

    const label = t('pages.create-course.trainer-expenses.accommodation')
    const formattedAmount = t('common.currency', {
      amount: getTrainerAccommodationCost(accommodationNights),
    })
    const caption = t(
      'pages.create-course.review-and-confirm.caption.accommodation',
      { count: accommodationNights }
    )

    return <PageRow label={label} value={formattedAmount} caption={caption} />
  }, [t, expenses.transport])

  return (
    <Box data-testid={`${trainerName}-trainer-expenses`}>
      <PageRow />
      <PageRow isBold={true} label={trainerName} />
      {expenses.transport
        ?.filter(({ method }) => method !== TransportMethod.NONE)
        .map((e, idx) => getRowForExpense(e, 'transport', idx))}
      {accommodationRow}
      {expenses.miscellaneous?.map((e, idx) =>
        getRowForExpense(e, 'miscellaneous', idx)
      )}
    </Box>
  )
}

export const PageContent = () => {
  const { t } = useTranslation()
  const { courseData, expenses, trainers } = useCreateCourse()

  const { data, error } = useSWR<GetCoursePricingResponseType, Error>([
    GET_COURSE_PRICING,
    courseData
      ? {
          type: courseData.type as unknown as Course_Type_Enum,
          level: courseData.courseLevel as unknown as Course_Level_Enum,
          blended: courseData.blendedLearning,
          reaccreditation: courseData.reaccreditation,
        }
      : null,
  ])

  const getCoursePricingStatus = getSWRLoadingStatus(data, error)

  const courseName = useMemo(
    () =>
      courseData
        ? generateCourseName(
            {
              level: courseData.courseLevel,
              reaccreditation: courseData.reaccreditation,
            },
            t
          )
        : '',
    [courseData, t]
  )

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
        (acc, { method, value, accommodationNights }) => {
          const cost =
            (method === TransportMethod.CAR
              ? getTrainerCarCostPerMile(value)
              : value) ?? 0
          const accommodationCost =
            (accommodationNights ?? 0) > 0
              ? getTrainerAccommodationCost(accommodationNights)
              : 0

          return (
            roundToTwoDecimals(acc) +
            roundToTwoDecimals(cost) +
            roundToTwoDecimals(accommodationCost)
          )
        },
        0
      )

      const miscellaneousCost =
        expense.miscellaneous?.reduce(
          (acc, { value }) =>
            roundToTwoDecimals(acc) + roundToTwoDecimals(value ?? 0),
          0
        ) ?? 0

      result += transportCost + miscellaneousCost
    }

    return result
  }, [expenses])

  const [courseBasePrice, subtotal, freeSpacesDiscount, vat, amountDue] =
    useMemo(() => {
      if (!courseData || !data || !data.coursePricing) {
        return []
      }

      const pricing = data.coursePricing[0]

      const courseBasePrice = roundToTwoDecimals(
        pricing.priceAmount * courseData.maxParticipants
      )
      const freeSpacesDiscount = roundToTwoDecimals(
        -pricing.priceAmount * courseData.freeSpaces
      )
      const subtotal = courseBasePrice + freeSpacesDiscount
      const vat = roundToTwoDecimals(
        getVatAmount(subtotal + trainerExpensesTotal)
      )
      const amountDue = subtotal + vat + trainerExpensesTotal

      return [courseBasePrice, subtotal, freeSpacesDiscount, vat, amountDue]
    }, [courseData, data, trainerExpensesTotal])

  if (getCoursePricingStatus === LoadingStatus.ERROR) {
    return (
      <>
        <Alert severity="error" data-testid="ReviewAndConfirm-alert-pricing">
          {t('pages.create-course.review-and-confirm.pricing-fetching-error')}
        </Alert>
      </>
    )
  }

  if (!courseData) {
    return null
  }

  return (
    <Stack spacing={2} data-testid="ReviewAndConfirm-page-content">
      <Typography variant="subtitle1">
        {t('pages.create-course.review-and-confirm.title')}
      </Typography>

      <Stack spacing={2} pl={2}>
        <Typography variant="body1" fontWeight={600}>
          {courseName} - {courseDuration}
        </Typography>

        <Typography variant="body2">
          {t('dates.withTime', { date: startDate })} -{' '}
          {t('dates.withTime', { date: endDate })}
        </Typography>

        <PageRow />

        <PageRow
          label={t(
            'pages.create-course.review-and-confirm.sales-representative'
          )}
          value={courseData.salesRepresentative?.fullName}
        />
        <PageRow
          label={t('pages.create-course.review-and-confirm.account-code')}
          value={courseData.accountCode}
        />

        {trainers?.map(trainer => (
          <Fragment key={trainer.profile_id}>
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
          </Fragment>
        ))}

        <PageRow />

        <PageRow
          label={t(
            'pages.create-course.review-and-confirm.trainer-expenses-total'
          )}
          value={t('common.currency', { amount: trainerExpensesTotal })}
        />

        <PageRow />

        <PageRow
          label={t('pages.create-course.review-and-confirm.base-price', {
            count: courseData.maxParticipants,
          })}
          value={t('common.currency', { amount: courseBasePrice })}
        />

        <PageRow />

        <PageRow
          label={t('pages.create-course.review-and-confirm.subtotal')}
          value={t('common.currency', { amount: subtotal })}
        />
        <PageRow
          label={t('pages.create-course.review-and-confirm.free-spaces', {
            count: courseData.freeSpaces,
          })}
          value={t('common.currency', { amount: freeSpacesDiscount })}
        />
        <PageRow
          label={t('pages.create-course.review-and-confirm.vat')}
          value={t('common.currency', { amount: vat })}
        />

        <PageRow />

        <PageRow
          isBold={true}
          label={t('pages.create-course.review-and-confirm.amount-due')}
          value={t('common.currency', { amount: amountDue })}
        />
      </Stack>
    </Stack>
  )
}
