import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { parseISO } from 'date-fns'
import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import { Course_Type_Enum } from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import useTimeZones from '@app/hooks/useTimeZones'
import { InvoiceDetails } from '@app/modules/course/components/CourseForm/components/InvoiceDetails'
import { LoadingStatus } from '@app/util'

import { useSaveCourse } from '../../hooks/useSaveCourse'
import { StepsEnum } from '../../types'
import { useCreateCourse } from '../CreateCourseProvider'

export const ReviewLicenseOrder: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { acl } = useAuth()
  const { go1Licensing, courseData, setCurrentStepKey, completeStep } =
    useCreateCourse()
  const { saveCourse, savingStatus } = useSaveCourse()
  const { addSnackbarMessage } = useSnackbar()
  const { defaultCurrency, currencyAbbreviations } = useCurrencies(
    courseData?.residingCountry,
  )
  const { isAustraliaCountry } = useWorldCountries()

  const currencyAbbreviation = currencyAbbreviations[defaultCurrency]

  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const hasSavingError = savingStatus === LoadingStatus.ERROR

  const { _t, t } = useScopedTranslation(
    'pages.create-course.license-order-review',
  )
  const navigate = useNavigate()

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

  useEffect(() => {
    setCurrentStepKey(StepsEnum.REVIEW_AND_CONFIRM)
  }, [setCurrentStepKey])

  const displayTaxRow = acl.isAustralia()
    ? isAustraliaCountry(courseData?.residingCountry)
    : go1Licensing?.prices.vat

  const handleSubmitButtonClick = async () => {
    if (acl.isTrainer() && courseData?.type === Course_Type_Enum.Indirect) {
      navigate(`/courses/new/modules`)
      return
    }

    const savedCourse = await saveCourse()

    if (savedCourse?.id) {
      if (
        courseData?.type === Course_Type_Enum.Indirect &&
        acl.isInternalUser()
      ) {
        completeStep(StepsEnum.REVIEW_AND_CONFIRM)

        if (savedCourse.hasExceptions) {
          addSnackbarMessage('course-created', {
            label: _t('pages.create-course.submitted-closed-exceptions', {
              code: savedCourse?.courseCode,
            }),
          })
        }

        navigate(`/manage-courses/all/${savedCourse?.id}/details`)

        return
      }

      navigate(`/courses/${savedCourse.id}/modules`)
    }
  }

  const courseTimezone = courseData?.timeZone
    ? courseData?.timeZone.timeZoneId
    : undefined

  const taxType = acl.isAustralia() ? _t('common.gst') : _t('common.vat')
  const taxAmount = acl.isAustralia()
    ? go1Licensing?.prices.gst
    : go1Licensing?.prices.vat

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500" mb={2}>
        {t('title')}
      </Typography>

      {hasSavingError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('saving-error-message')}
        </Alert>
      ) : null}

      {!courseData || !go1Licensing ? (
        <Alert
          severity="error"
          variant="outlined"
          data-testid="license-order-details-not-found"
        >
          {_t('pages.create-course.course-not-found')}
        </Alert>
      ) : null}

      <Stack spacing="2px">
        {courseData ? (
          <InfoPanel
            title={`${_t('common.blended-learning')} - ${_t(
              `common.course-levels.${courseData.courseLevel}`,
            )}`}
          >
            <InfoRow
              label={`${_t('dates.long', {
                date: courseData.startDateTime,
              })} - ${_t('dates.long', {
                date: courseData.endDateTime,
              })}`}
            />
            <InfoRow
              label={`${_t('dates.time', {
                date: startDate,
              })} ${formatGMTDateTimeByTimeZone(
                startDate as Date,
                courseTimezone,
                false,
              )} - ${_t('dates.time', {
                date: endDate,
              })} ${formatGMTDateTimeByTimeZone(
                endDate as Date,
                courseTimezone,
                true,
              )} `}
            />
          </InfoPanel>
        ) : null}

        {go1Licensing ? (
          <>
            <InfoPanel title={_t('common.payment-method')}>
              <InfoRow label={_t('common.pay-by-inv')}></InfoRow>
            </InfoPanel>
            <InfoPanel>
              <InvoiceDetails details={go1Licensing.invoiceDetails} />
            </InfoPanel>
            <InfoPanel>
              <InfoRow
                label={_t('pages.order-details.licenses-redeemed')}
                value={courseData?.maxParticipants.toString()}
              />
            </InfoPanel>
          </>
        ) : null}

        <InfoPanel>
          <InfoRow
            label={_t('common.subtotal')}
            value={_t('common.amount-with-currency', {
              amount: go1Licensing
                ? (
                    go1Licensing?.prices.subtotal -
                    (go1Licensing?.prices.allowancePrice ?? 0)
                  ).toFixed(2)
                : undefined,
              currency: currencyAbbreviation,
            })}
          />
          {displayTaxRow ? (
            <InfoRow
              label={taxType}
              value={_t('common.amount-with-currency', {
                amount: taxAmount?.toFixed(2),
                currency: currencyAbbreviation,
              })}
            />
          ) : null}
        </InfoPanel>
        <InfoPanel>
          <InfoRow>
            <Typography fontWeight="600">{_t('common.amount-due')}</Typography>
            <Typography fontWeight="600">
              {_t('common.amount-with-currency', {
                amount: go1Licensing?.prices.amountDue.toFixed(2),
                currency: currencyAbbreviation,
              })}
            </Typography>
          </InfoRow>
        </InfoPanel>
      </Stack>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4, mb: 4 }}>
        <Button
          onClick={() => navigate(`../license-order-details?type=INDIRECT`)}
          startIcon={<ArrowBackIcon />}
        >
          {t('back-btn-text')}
        </Button>

        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            loading={savingStatus === LoadingStatus.FETCHING}
            onClick={() => {
              if (!(!courseData || !go1Licensing)) handleSubmitButtonClick()
            }}
            data-testid="courseBuilder-button"
            disabled={!courseData || !go1Licensing}
          >
            {courseData?.type === Course_Type_Enum.Indirect &&
            acl.isInternalUser()
              ? _t('pages.create-course.review-and-confirm.submit-btn')
              : _t('pages.create-course.course-builder-button-text')}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
