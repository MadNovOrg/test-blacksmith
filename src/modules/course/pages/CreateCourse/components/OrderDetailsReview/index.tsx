import { Box, Stack, Typography } from '@mui/material'
import Big from 'big.js'
import { parseISO } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { useAuth } from '@app/context/auth'
import { Accreditors_Enum, Currency } from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies/useCurrencies'
import useTimeZones from '@app/hooks/useTimeZones'
import { InvoiceDetails } from '@app/modules/course/components/CourseForm/components/InvoiceDetails'
import { TransportMethod } from '@app/types'
import {
  getFreeCourseMaterialsCost,
  getGSTAmount,
  getMandatoryCourseMaterialsCost,
  getTrainerCarCostPerMile,
  getTrainerSubsistenceCost,
  getVatAmount,
} from '@app/util'

import { useCreateCourse } from '../CreateCourseProvider'

import { ExpensesDetails } from './ExpensesDetails'
import { PageRow } from './PageRow'

export const OrderDetailsReview: React.FC = () => {
  const { t } = useTranslation()
  const { isUKCountry, isAustraliaCountry } = useWorldCountries()
  const { courseData, courseName, trainers, expenses, invoiceDetails } =
    useCreateCourse()

  const { defaultCurrency } = useCurrencies(courseData?.residingCountry)
  const {
    acl: { isAustralia },
  } = useAuth()

  const currency = courseData?.priceCurrency ?? defaultCurrency

  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const courseMaterialsCost = useMemo(() => {
    if (
      courseData?.freeCourseMaterials !== null &&
      courseData?.freeCourseMaterials !== undefined
    ) {
      return getMandatoryCourseMaterialsCost(
        courseData?.maxParticipants,
        currency as Currency,
      )
    }
    return 0
  }, [courseData?.freeCourseMaterials, courseData?.maxParticipants, currency])

  const freeCourseMaterialsCost = useMemo(() => {
    if (
      courseData?.freeCourseMaterials !== null &&
      courseData?.freeCourseMaterials !== undefined
    ) {
      return getFreeCourseMaterialsCost(
        courseData?.freeCourseMaterials,
        currency as Currency,
      )
    }
    return 0
  }, [courseData?.freeCourseMaterials, currency])

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
    [courseData],
  )
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
            Number((accommodationNights ?? 0) > 0) &&
            getTrainerSubsistenceCost(
              accommodationNights,
              isUKCountry(courseData?.residingCountry),
            )

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
  }, [expenses, courseData?.residingCountry, isUKCountry])

  const [courseBasePrice, subtotal, freeSpacesDiscount, vat, amountDue] =
    useMemo(() => {
      if (!courseData) {
        return []
      }

      const courseBasePrice = new Big(courseData?.price ?? 0).times(
        courseData.maxParticipants,
      )

      const freeSpacesDiscount = new Big(courseData?.price ?? 0)
        .times(courseData.freeSpaces ?? 0)
        .neg()

      const subtotal = courseBasePrice
        .add(freeSpacesDiscount)
        .add(trainerExpensesTotal)
        .add(courseMaterialsCost)
        .add(freeCourseMaterialsCost)

      const totalWithTax = subtotal
        .minus(courseMaterialsCost)
        .minus(freeCourseMaterialsCost)
        .toNumber()

      const vat = () => {
        if (
          isAustralia() &&
          (courseData.includeVAT ||
            isAustraliaCountry(courseData?.residingCountry))
        ) {
          return getGSTAmount(totalWithTax)
        }

        if (courseData.includeVAT || isUKCountry(courseData?.residingCountry)) {
          return getVatAmount(totalWithTax)
        }
        return 0
      }
      const amountDue = subtotal.add(new Big(vat()))

      return [
        courseBasePrice.round().toNumber(),
        subtotal.round().toNumber(),
        freeSpacesDiscount.round().toNumber(),
        new Big(vat()).round().toNumber(),
        amountDue.round().toNumber(),
      ]
    }, [
      courseData,
      trainerExpensesTotal,
      courseMaterialsCost,
      freeCourseMaterialsCost,
      isUKCountry,
      isAustralia,
      isAustraliaCountry,
    ])

  const courseVenue = courseData?.venue
  const locationNameAddressCity = [
    courseVenue?.name,
    courseVenue?.addressLineOne,
    courseVenue?.addressLineTwo,
    courseVenue?.city,
  ]
    .filter(item => item)
    .join(', ')
  const locationPostCodeCountry = [courseVenue?.postCode, courseVenue?.country]
    .filter(item => item)
    .join(', ')

  const courseTimezone = courseData?.timeZone
    ? courseData?.timeZone.timeZoneId
    : undefined

  const taxType = () => {
    if (isAustralia()) {
      return {
        withTax: 'pages.create-course.review-and-confirm.gst',
        withoutTax: 'pages.create-course.review-and-confirm.no-gst',
      }
    }
    return {
      withTax: 'pages.create-course.review-and-confirm.vat',
      withoutTax: 'pages.create-course.review-and-confirm.no-vat',
    }
  }

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
          {courseName}
        </Typography>

        <Typography data-testid="course-dates">
          {`${t('dates.withTime', {
            date: startDate,
          })} ${formatGMTDateTimeByTimeZone(
            startDate as Date,
            courseTimezone,
            false,
          )} - ${t('dates.withTime', {
            date: endDate,
          })} ${formatGMTDateTimeByTimeZone(
            endDate as Date,
            courseTimezone,
            true,
          )} `}
        </Typography>
      </InfoPanel>

      <InfoPanel>
        <Typography color="grey.700" mb={1}>
          {t('location')}
        </Typography>
        <Box flexDirection="column">
          <Typography color="grey.700">{locationNameAddressCity}</Typography>
          <Typography color="grey.700">{locationPostCodeCountry}</Typography>
        </Box>
      </InfoPanel>

      <InfoPanel>
        <Stack spacing={1}>
          <PageRow
            label={t(
              'pages.create-course.review-and-confirm.sales-representative',
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
          {expenses?.[trainer.profile_id] ? (
            <ExpensesDetails
              expenses={expenses?.[trainer.profile_id]}
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
            'pages.create-course.review-and-confirm.trainer-expenses-total',
          )}
          value={t('common.currency', {
            amount: trainerExpensesTotal,
            currency,
          })}
          testId="trainer-total-expenses"
        />
      </InfoPanel>

      <InfoPanel>
        <PageRow
          label={t('pages.create-course.review-and-confirm.base-price')}
          value={t('common.currency', { amount: courseBasePrice, currency })}
          testId="course-price-row"
        />
      </InfoPanel>

      <InfoPanel>
        <PageRow
          label={t(
            'pages.create-course.review-and-confirm.mandatory-course-materials',
            {
              count: courseData?.maxParticipants,
            },
          )}
          value={t('common.currency', {
            amount: courseMaterialsCost,
            currency,
          })}
          testId="mandatory-course-materials-row"
        />
        <PageRow
          label={t(
            'pages.create-course.review-and-confirm.free-course-materials',
            {
              count: courseData?.freeCourseMaterials,
            },
          )}
          value={t('common.currency', {
            amount: freeCourseMaterialsCost,
            currency,
          })}
          testId="free-course-materials-row"
        />
      </InfoPanel>

      <InfoPanel>
        <Stack spacing={1}>
          <PageRow
            label={t('pages.create-course.review-and-confirm.free-spaces', {
              count: courseData?.freeSpaces,
            })}
            value={t('common.currency', {
              amount: freeSpacesDiscount,
              currency,
            })}
            testId="free-spaces-row"
          />

          <PageRow
            label={t('pages.create-course.review-and-confirm.subtotal')}
            value={t('common.currency', { amount: subtotal, currency })}
            testId="subtotal-row"
          />

          <PageRow
            label={t(
              courseData?.includeVAT ||
                courseData?.accreditedBy === Accreditors_Enum.Bild
                ? taxType().withTax
                : taxType().withoutTax,
            )}
            value={t('common.currency', { amount: vat, currency })}
            testId="vat-row"
          />
        </Stack>
      </InfoPanel>

      <InfoPanel>
        <PageRow
          isBold={true}
          label={t('pages.create-course.review-and-confirm.amount-due', {
            currency,
          })}
          value={t('common.currency', { amount: amountDue, currency })}
          testId="total-costs-row"
        />
      </InfoPanel>
    </Stack>
  )
}
