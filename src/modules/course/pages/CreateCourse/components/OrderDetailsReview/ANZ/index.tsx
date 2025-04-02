import { Box, Stack, Typography } from '@mui/material'
import Big from 'big.js'
import { parseISO } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies/useCurrencies'
import useTimeZones from '@app/hooks/useTimeZones'
import { InvoiceDetails } from '@app/modules/course/components/CourseForm/components/InvoiceDetails'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { getGSTAmount } from '@app/util'

import { useCreateCourse } from '../../CreateCourseProvider'
import { ExpensesDetails } from '../ExpensesDetails'
import { PageRow } from '../PageRow'

import { getTrainerExpensesTotal } from './utils'

export const OrderDetailsReview: React.FC = () => {
  const { t } = useTranslation()
  const { isAustraliaCountry } = useWorldCountries()
  const { courseData, courseName, trainers, expenses, invoiceDetails } =
    useCreateCourse()
  const { defaultCurrency } = useCurrencies(courseData?.residingCountry)

  const hideMCM = useFeatureFlagEnabled('hide-mcm')
  const mandatoryCourseMaterialsEnabled = Boolean(!hideMCM)

  const currency = courseData?.priceCurrency ?? defaultCurrency
  const { data: resourcePackPricingData } = useResourcePackPricing({
    course_type: courseData?.type as Course_Type_Enum,
    course_level: courseData?.courseLevel as Course_Level_Enum,
    course_delivery_type: courseData?.deliveryType as Course_Delivery_Type_Enum,
    reaccreditation: courseData?.reaccreditation ?? false,
    pause: Boolean(hideMCM),
  })

  const rpPrice = useMemo(
    () =>
      currency === Currency.Nzd
        ? resourcePackPricingData?.resource_packs_pricing[0]?.NZD_price ?? 0
        : resourcePackPricingData?.resource_packs_pricing[0]?.AUD_price ?? 0,
    [currency, resourcePackPricingData?.resource_packs_pricing],
  )

  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const courseMaterialsCost = useMemo(() => {
    if (
      mandatoryCourseMaterialsEnabled &&
      courseData?.freeCourseMaterials !== null &&
      courseData?.freeCourseMaterials !== undefined
    ) {
      return courseData.maxParticipants * (rpPrice ?? 0)
    }
    return 0
  }, [
    courseData?.freeCourseMaterials,
    courseData?.maxParticipants,
    mandatoryCourseMaterialsEnabled,
    rpPrice,
  ])

  const freeCourseMaterialsCost = useMemo(() => {
    if (
      !hideMCM &&
      courseData?.freeCourseMaterials !== null &&
      courseData?.freeCourseMaterials !== undefined
    ) {
      return courseData.freeCourseMaterials * rpPrice * -1
    }
    return 0
  }, [courseData?.freeCourseMaterials, hideMCM, rpPrice])

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
  const trainerExpensesTotal = getTrainerExpensesTotal(
    expenses,
    currency as Currency,
  )

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

      const totalWithTax = subtotal.toNumber()

      const vat = () => {
        if (
          courseData.includeVAT ||
          isAustraliaCountry(courseData?.residingCountry)
        ) {
          return getGSTAmount(totalWithTax)
        }
        return 0
      }
      const amountDue = subtotal.add(new Big(vat()))

      return [
        courseBasePrice.round(2).toNumber(),
        subtotal.round(2).toNumber(),
        freeSpacesDiscount.round(2).toNumber(),
        new Big(vat()).round(2).toNumber(),
        amountDue.round(2).toNumber(),
      ]
    }, [
      courseData,
      trainerExpensesTotal,
      courseMaterialsCost,
      freeCourseMaterialsCost,
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
    return {
      withTax: 'pages.create-course.review-and-confirm.gst',
      withoutTax: 'pages.create-course.review-and-confirm.no-gst',
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

      {mandatoryCourseMaterialsEnabled ? (
        <InfoPanel>
          <PageRow
            label={t(
              'pages.create-course.review-and-confirm.mandatory-resource-packs',
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
              'pages.create-course.review-and-confirm.free-resource-packs',
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
      ) : null}

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
