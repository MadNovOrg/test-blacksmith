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
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import useTimeZones from '@app/hooks/useTimeZones'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { InvoiceDetails } from '@app/modules/course/components/CourseForm/components/InvoiceDetails'
import {
  getResourcePacksTypeOptionLabels,
  matchResourcePacksCourseFieldsToSelectOption,
} from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/utils'
import { WorkbookAddressDetails } from '@app/modules/course/components/CourseForm/components/WorkbooksAddressDetails'
import {
  calculateGo1LicenseCost,
  calculateResourcePackCost,
} from '@app/modules/course/pages/CreateCourse/utils'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { InvoiceDetails as InvoiceDetailsType } from '@app/types'
import { getResourcePackPrice } from '@app/util'

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

  const { isAustraliaCountry } = useWorldCountries()

  const state = location.state as {
    extraResourcePacksRequiredToBuy: number
    insufficientNumberOfLicenses: number
    invitees: Record<string, unknown>[]
  } | null

  const { acl } = useAuth()

  const resourcePacksTypeOptions = useMemo(
    () => getResourcePacksTypeOptionLabels(_t),
    [_t],
  )

  const {
    additionalLicensesOrderOnly,
    additionalResourcePacksToPurchase,
    canGoToCourseBuilder,
    courseData,
    fetching,
    getCourseName,
    preEditedCourse,
    requiredLicenses,
    saveAdditionalLicensesOrder,
    saveChanges,
    setAdditionalLicensesOrderOnly,
    setIndirectCourseInvitesAfterCourseCompletion,
    setInvoiceDetails,
  } = useEditCourse()

  const { data: resourcePackCost } = useResourcePackPricing({
    course_delivery_type:
      preEditedCourse?.deliveryType as Course_Delivery_Type_Enum,
    course_level: preEditedCourse?.level as Course_Level_Enum,
    course_type: preEditedCourse?.type as Course_Type_Enum,
    organisation_id: preEditedCourse?.organization?.id ?? '',
    pause: !preEditedCourse?.resourcePacksType,
    reaccreditation: Boolean(preEditedCourse?.reaccreditation),
    resourcePacksOptions: courseData?.resourcePacksType,
  })

  const rpPrice = getResourcePackPrice(
    resourcePackCost?.resource_packs_pricing[0],
    courseData?.priceCurrency,
  )

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

  const extraResourcePacksToPurchase =
    state?.extraResourcePacksRequiredToBuy ?? additionalResourcePacksToPurchase

  const go1LicensesPrices = useMemo(() => {
    if (numberOfLicenses > 0) {
      return calculateGo1LicenseCost({
        isAustralia: acl.isAustralia(),
        isAustraliaCountry: isAustraliaCountry(
          preEditedCourse?.residingCountry,
        ),
        // state.insufficientNumberOfLicenses represents the exact number of licenses required for purchase, which is why licenseBalance needs to be set to 0
        licenseBalance: state?.insufficientNumberOfLicenses
          ? 0
          : Math.max(
              0,
              preEditedCourse?.organization?.mainOrganizationLicenses
                ?.go1Licenses ??
                preEditedCourse?.organization?.go1Licenses ??
                0,
            ),
        numberOfLicenses: numberOfLicenses,
        residingCountry: courseData?.residingCountry ?? undefined,
      })
    }

    return null
  }, [
    acl,
    numberOfLicenses,
    courseData?.residingCountry,
    isAustraliaCountry,
    preEditedCourse?.organization?.go1Licenses,
    preEditedCourse?.organization?.mainOrganizationLicenses?.go1Licenses,
    preEditedCourse?.residingCountry,
    state?.insufficientNumberOfLicenses,
  ])

  const coursesResourcePacksOption = useMemo(() => {
    if (preEditedCourse && extraResourcePacksToPurchase > 0) {
      return matchResourcePacksCourseFieldsToSelectOption({
        resourcePacksType:
          preEditedCourse.resourcePacksType as Resource_Packs_Type_Enum,
        resourcePacksDeliveryType:
          preEditedCourse.resourcePacksDeliveryType ?? null,
      })
    }

    return null
  }, [extraResourcePacksToPurchase, preEditedCourse])

  const resourcePacksPrices = useMemo(() => {
    if (
      extraResourcePacksToPurchase > 0 ||
      ((state?.insufficientNumberOfLicenses ?? 0) > 0 &&
        coursesResourcePacksOption)
    ) {
      return calculateResourcePackCost({
        numberOfResourcePacks: extraResourcePacksToPurchase,
        residingCountry: courseData?.residingCountry,
        resourcePacksBalance: 0,
        resourcePacksPrice: rpPrice,
      })
    }

    return null
  }, [
    extraResourcePacksToPurchase,
    courseData?.residingCountry,
    coursesResourcePacksOption,
    rpPrice,
    state?.insufficientNumberOfLicenses,
  ])

  const currencyAbbreviation = currencyAbbreviations[defaultCurrency]

  const taxType = acl.isAustralia() ? _t('common.gst') : _t('common.vat')

  const taxAmount = useMemo(() => {
    if (acl.isUK()) return go1LicensesPrices?.vat ?? 0

    return (go1LicensesPrices?.gst ?? 0) + (resourcePacksPrices?.gst ?? 0)
  }, [
    acl,
    go1LicensesPrices?.gst,
    go1LicensesPrices?.vat,
    resourcePacksPrices?.gst,
  ])

  const subtotal = useMemo(() => {
    const go1LicensesSubtotal =
      (go1LicensesPrices?.subtotal ?? 0) -
      (go1LicensesPrices?.allowancePrice ?? 0)

    const resourcePacksSubtotal = resourcePacksPrices?.subtotal ?? 0

    return go1LicensesSubtotal + resourcePacksSubtotal
  }, [
    go1LicensesPrices?.allowancePrice,
    go1LicensesPrices?.subtotal,
    resourcePacksPrices?.subtotal,
  ])

  const amountDue = useMemo(
    () =>
      (go1LicensesPrices?.amountDue ?? 0) +
      (resourcePacksPrices?.amountDue ?? 0),
    [go1LicensesPrices?.amountDue, resourcePacksPrices?.amountDue],
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
    [courseData],
  )

  const courseTimezone = courseData?.timeZone
    ? courseData?.timeZone.timeZoneId
    : undefined

  const orderDetailsTitle = useMemo(() => {
    if (
      (go1LicensesPrices?.amountDue ?? 0) > 0 &&
      (resourcePacksPrices?.amountDue ?? 0) > 0
    ) {
      return _t(
        'pages.edit-course.purchase-additional-licences-and-resource-packs',
        { courseLevel: _t(`common.course-levels.${preEditedCourse?.level}`) },
      )
    }

    if ((go1LicensesPrices?.amountDue ?? 0) > 0) {
      return _t('pages.edit-course.purchase-additional-licences', {
        courseLevel: _t(`common.course-levels.${preEditedCourse?.level}`),
      })
    }

    if ((resourcePacksPrices?.amountDue ?? 0) > 0) {
      return _t('pages.edit-course.purchase-additional-resource-packs', {
        courseLevel: _t(`common.course-levels.${preEditedCourse?.level}`),
      })
    }

    return ''
  }, [
    _t,
    go1LicensesPrices?.amountDue,
    preEditedCourse?.level,
    resourcePacksPrices?.amountDue,
  ])

  useEffect(() => {
    if (!orderData?.order_by_pk) return

    setInvoiceDetails({
      ...orderData.order_by_pk,
      orgId: orderData.order_by_pk?.organization.id,
      orgName: orderData.order_by_pk?.organization.name,
    } as InvoiceDetailsType)
  }, [
    numberOfLicenses,
    go1LicensesPrices,
    orderData?.order_by_pk,
    setInvoiceDetails,
  ])

  useEffect(() => {
    if (
      (state?.insufficientNumberOfLicenses ||
        state?.insufficientNumberOfLicenses === 0) &&
      !courseData
    ) {
      setAdditionalLicensesOrderOnly(true)
      setIndirectCourseInvitesAfterCourseCompletion(state.invitees)
    }
  }, [
    courseData,
    setAdditionalLicensesOrderOnly,
    setIndirectCourseInvitesAfterCourseCompletion,
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
                  {_t(`course-types.${preEditedCourse.type}`)}
                </Typography>
              </Box>
            </Sticky>
          </Box>
          <Box flex={1}>
            <Box mt={isMobile ? 4 : 8}>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="500" mb={2}>
                  Confirm to complete editing
                </Typography>

                <Stack spacing="2px">
                  {courseData ? (
                    <InfoPanel title={orderDetailsTitle}>
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
                      {orderData.order_by_pk?.workbookDeliveryAddress ? (
                        <InfoPanel>
                          <WorkbookAddressDetails
                            details={
                              orderData.order_by_pk?.workbookDeliveryAddress
                            }
                          />
                        </InfoPanel>
                      ) : null}

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
                      {licensesToPurchase > 0 ? (
                        <InfoPanel>
                          <InfoRow
                            label={_t('pages.order-details.licenses-redeemed')}
                            value={licensesToPurchase.toString()}
                          />
                        </InfoPanel>
                      ) : null}
                      {extraResourcePacksToPurchase > 0 &&
                      coursesResourcePacksOption ? (
                        <InfoPanel>
                          <InfoRow
                            label={_t(
                              'pages.order-details.resource-packs-redeemed',
                              {
                                resourcePacksType:
                                  resourcePacksTypeOptions[
                                    coursesResourcePacksOption
                                  ],
                              },
                            ).replace(/&amp;/g, '&')}
                            value={extraResourcePacksToPurchase.toString()}
                          />
                        </InfoPanel>
                      ) : null}
                    </>
                  ) : null}

                  <InfoPanel>
                    <InfoRow
                      label={_t('common.subtotal')}
                      value={_t('common.amount-with-currency', {
                        amount: subtotal.toFixed(2),
                        currency: currencyAbbreviation,
                      })}
                    />

                    <InfoRow
                      label={taxType}
                      value={_t('common.amount-with-currency', {
                        amount: taxAmount?.toFixed(2),
                        currency: currencyAbbreviation,
                      })}
                    />
                  </InfoPanel>
                  <InfoPanel>
                    <InfoRow>
                      <Typography fontWeight="600">
                        {_t('common.amount-due')}
                      </Typography>
                      <Typography fontWeight="600">
                        {_t('common.amount-with-currency', {
                          amount: amountDue.toFixed(2),
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
                  loading={fetching}
                  onClick={() => {
                    if (additionalLicensesOrderOnly) {
                      saveAdditionalLicensesOrder()
                      return
                    }

                    saveChanges()
                  }}
                  data-testid="courseBuilder-button"
                  disabled={fetching}
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
