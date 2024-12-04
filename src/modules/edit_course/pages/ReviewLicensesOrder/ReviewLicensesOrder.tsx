import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { To, useLocation, useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import useTimeZones from '@app/hooks/useTimeZones'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { InvoiceDetails } from '@app/modules/course/components/CourseForm/components/InvoiceDetails'
import { calculateGo1LicenseCost } from '@app/modules/course/pages/CreateCourse/utils'
import { InvoiceDetails as InvoiceDetailsType } from '@app/types'

import { useEditCourse } from '../../contexts/EditCourseProvider/EditCourseProvider'
import { useOrderDetailsForReview } from '../../queries/get-indirect-course-order'

export const ReviewLicensesOrder: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { _t, t } = useScopedTranslation(
    'pages.create-course.license-order-review',
  )

  const state = location.state as {
    insufficientNumberOfLicenses: number
    invitees: Record<string, unknown>[]
  } | null

  const { acl } = useAuth()

  const {
    additionalLicensesOrderOnly,
    canGoToCourseBuilder,
    courseData,
    getCourseName,
    preEditedCourse,
    requiredLicenses,
    saveAdditionalLicensesOrder,
    saveChanges,
    setAdditionalLicensesOrderOnly,
    setBlendedLearningIndirectCourseInvitees,
    setGo1LicensesData,
  } = useEditCourse()

  const [{ data: orderData }] = useOrderDetailsForReview(
    preEditedCourse?.orders ? preEditedCourse?.orders[0].order.id ?? '' : '',
  )

  const { defaultCurrency, currencyAbbreviations } = useCurrencies(
    courseData?.residingCountry ?? '',
  )
  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const numberOfLicenses =
    state?.insufficientNumberOfLicenses ?? requiredLicenses

  const licensesToPurchase =
    state?.insufficientNumberOfLicenses ??
    requiredLicenses -
      Math.max(
        0,
        preEditedCourse?.organization?.mainOrganizationLicenses?.go1Licenses ??
          preEditedCourse?.organization?.go1Licenses ??
          0,
      )

  const prices = useMemo(
    () =>
      calculateGo1LicenseCost({
        isAustralia: acl.isAustralia(),
        licenseBalance: Math.max(
          0,
          preEditedCourse?.organization?.mainOrganizationLicenses
            ?.go1Licenses ??
            preEditedCourse?.organization?.go1Licenses ??
            0,
        ),
        numberOfLicenses,
        residingCountry: courseData?.residingCountry ?? undefined,
      }),
    [
      acl,
      courseData?.residingCountry,
      numberOfLicenses,
      preEditedCourse?.organization?.go1Licenses,
      preEditedCourse?.organization?.mainOrganizationLicenses?.go1Licenses,
    ],
  )

  const currencyAbbreviation = currencyAbbreviations[defaultCurrency]

  const taxAmount = acl.isAustralia() ? prices.gst : prices.vat

  const taxType = acl.isAustralia() ? _t('common.gst') : _t('common.vat')

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

  const courseTimezone = courseData?.timeZone
    ? courseData?.timeZone.timeZoneId
    : undefined

  useEffect(() => {
    if (!orderData?.order_by_pk) return

    setGo1LicensesData({
      prices,
      invoiceDetails: {
        ...orderData.order_by_pk,
        orgId: orderData.order_by_pk?.organization.id,
        orgName: orderData.order_by_pk?.organization.name,
      } as InvoiceDetailsType,
      quantity: numberOfLicenses,
    })
  }, [numberOfLicenses, orderData?.order_by_pk, prices, setGo1LicensesData])

  useEffect(() => {
    if (
      (state?.insufficientNumberOfLicenses ||
        state?.insufficientNumberOfLicenses === 0) &&
      !courseData
    ) {
      setAdditionalLicensesOrderOnly(true)
      setBlendedLearningIndirectCourseInvitees(state.invitees)
    }
  }, [
    courseData,
    setAdditionalLicensesOrderOnly,
    setBlendedLearningIndirectCourseInvitees,
    state?.insufficientNumberOfLicenses,
    state?.invitees,
  ])

  if (!preEditedCourse || (!courseData && !additionalLicensesOrderOnly))
    return null

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box
          display="flex"
          paddingBottom={5}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton
                  label={_t('pages.edit-course.back-to-course-button', {
                    courseName: getCourseName(),
                  })}
                  to={`/${acl.isTrainer() ? 'courses' : 'manage-courses/all'}/${
                    preEditedCourse.id
                  }/details`}
                />
              </Box>
              <Typography variant="h2" mb={4}>
                {_t('pages.edit-course.title')}
              </Typography>

              <Box mb={4}>
                <Typography
                  mb={1}
                  variant="h6"
                  fontWeight={600}
                  color="dimGrey.main"
                >
                  {_t('status')}
                </Typography>
                <CourseStatusChip status={preEditedCourse.status} hideIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  mb={1}
                  fontWeight={600}
                  color="dimGrey.main"
                >
                  {_t('course-type')}
                </Typography>
                <Typography>
                  {t(`course-types.${preEditedCourse.type}`)}
                </Typography>
              </Box>
            </Sticky>
          </Box>
          <Box flex={1}>
            <Box mt={isMobile ? 4 : 8}>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="500" mb={2}>
                  {'Confirm to complete editing'}
                </Typography>

                <Stack spacing="2px">
                  {courseData ? (
                    <InfoPanel
                      title={`${_t('common.blended-learning')} - ${_t(
                        `common.course-levels.${preEditedCourse?.level}`,
                      )} Additional Blended Learning licenses purchase`}
                    >
                      <InfoRow
                        label={`${_t('dates.long', {
                          date: startDate,
                        })} - ${_t('dates.long', {
                          date: endDate,
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

                  {orderData ? (
                    <>
                      <InfoPanel title={_t('common.payment-method')}>
                        <InfoRow label={_t('common.pay-by-inv')}></InfoRow>
                      </InfoPanel>
                      <InfoPanel>
                        <InvoiceDetails
                          details={
                            {
                              ...orderData.order_by_pk,
                              orgName:
                                orderData.order_by_pk?.organization.name ?? '',
                              orgId: orderData.order_by_pk?.organization.id,
                            } as InvoiceDetailsType
                          }
                        />
                      </InfoPanel>
                      <InfoPanel>
                        <InfoRow
                          label={_t('pages.order-details.licenses-redeemed')}
                          value={licensesToPurchase.toString()}
                        />
                      </InfoPanel>
                    </>
                  ) : null}

                  <InfoPanel>
                    <InfoRow
                      label={_t('common.subtotal')}
                      value={_t('common.amount-with-currency', {
                        amount: prices
                          ? (
                              prices.subtotal - (prices.allowancePrice ?? 0)
                            ).toFixed(2)
                          : undefined,
                        currency: currencyAbbreviation,
                      })}
                    />
                    {prices.vat ? (
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
                      <Typography fontWeight="600">
                        {_t('common.amount-due')}
                      </Typography>
                      <Typography fontWeight="600">
                        {_t('common.amount-with-currency', {
                          amount: prices.amountDue.toFixed(2),
                          currency: currencyAbbreviation,
                        })}
                      </Typography>
                    </InfoRow>
                  </InfoPanel>
                </Stack>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ mt: 4, mb: 4 }}
            >
              <Button
                onClick={() => navigate(-1 as To)}
                startIcon={<ArrowBackIcon />}
              >
                {t('back-btn-text')}
              </Button>

              <Box sx={{ ml: 'auto' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={canGoToCourseBuilder ? <ArrowForwardIcon /> : null}
                  loading={false}
                  onClick={() => {
                    if (additionalLicensesOrderOnly) {
                      saveAdditionalLicensesOrder()
                      return
                    }

                    saveChanges()
                  }}
                  data-testid="courseBuilder-button"
                  disabled={false}
                >
                  {canGoToCourseBuilder
                    ? _t('pages.edit-course.course-builder-button-text')
                    : _t('pages.edit-course.save-button-text')}
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
