import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { uniqueId } from 'lodash/fp'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useCallback, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { DetailsItemBox, ItemRow } from '@app/components/DetailsItemRow'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Type_Enum,
  Course_Level_Enum,
  CreateOrderParticipantInput,
  Payment_Methods_Enum,
  Xero_Invoice_Status_Enum,
  XeroLineItem,
  XeroPhone,
  XeroPhoneType,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import useTimeZones from '@app/hooks/useTimeZones'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { CourseTitleAndDuration } from '@app/modules/course_details/components/CourseTitleAndDuration'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import {
  getTrainerExpensesLineItems,
  isDiscountLineItem,
  isFreeCourseMaterials,
  isGo1LicensesItem,
  isMandatoryCourseMaterials,
  isProcessingFeeLineItem,
  isRegistrantLineItem,
} from '@app/modules/order_details/utils'
import theme from '@app/theme'
import { INVOICE_STATUS_COLOR, isNotNullish } from '@app/util'

import useCourseOrders from '../../hooks/useCourseOrders'
import { useShallowAttendeeAudits } from '../../hooks/useShallowAttendeeAudits'

type OrderRegistrant = {
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  email: string
  firstName: string
  lastName: string
  postCode: string
  xeroLineItemID?: string
}

export const OrderDetails: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { t, _t } = useScopedTranslation('pages.order-details')
  const { acl } = useAuth()
  const { getLabel, isUKCountry } = useWorldCountries()
  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country',
  )

  const [{ data, fetching }] = useCourseOrders({ orderId: id ?? '' })

  const order = data?.orders[0]?.order

  const { promoCodes, isLoading: isUsePromoCodesLoading } = usePromoCodes({
    sort: { by: 'code', dir: 'asc' },
    filters: { code: order?.promoCodes ?? [] },
    limit: order?.promoCodes?.length ?? 0,
    offset: 0,
  })

  const courses = data?.orders.map(order => order.course)

  const mainCourse = useMemo(
    () => (courses?.length ? courses[0] : null),
    [courses],
  )

  const invoice = order?.invoice

  const registrants = useMemo(
    () =>
      (Array.isArray(order?.registrants)
        ? order?.registrants
        : []) as OrderRegistrant[],
    [order?.registrants],
  )

  const getCancellationAuditsArgs = useMemo(() => {
    return {
      where: {
        profile: {
          email: { _in: registrants.map(registrant => registrant.email) },
        },
      },
      xeroInvoiceNumber: order?.xeroInvoiceNumber as string,
      pause: !registrants.length,
    }
  }, [order?.xeroInvoiceNumber, registrants])

  const [{ data: participantAudits }] = useShallowAttendeeAudits(
    getCancellationAuditsArgs,
  )

  const cancellationAudits = useMemo(() => {
    return participantAudits?.cancellation
  }, [participantAudits?.cancellation])

  const replacementAudits = useMemo(() => {
    return participantAudits?.replacement
  }, [participantAudits?.replacement])

  const registrantsLineItems: (XeroLineItem & { lineItemID: string })[] =
    useMemo(() => {
      return mainCourse?.name
        ? invoice?.lineItems?.filter((li: XeroLineItem) =>
            isRegistrantLineItem(li, mainCourse.level),
          )
        : []
    }, [invoice, mainCourse])

  const cancelledRegistrantsLineItemIds = useMemo(() => {
    const matchRegistrant = registrants.filter(registrant =>
      cancellationAudits?.some(
        audit => audit.profile.email === registrant.email,
      ),
    )

    return matchRegistrant
      .map(registrant => ({
        email: registrant.email,
        xeroLineItemID: registrant.xeroLineItemID,
      }))
      .filter(id => Boolean(id))
  }, [cancellationAudits, registrants])

  const replacedRegistrants = useMemo(() => {
    const matchRegistrant = registrants.filter(registrant =>
      replacementAudits?.some(
        audit => audit.payload?.inviteeEmail === registrant.email,
      ),
    )
    return matchRegistrant
      .map(({ email, xeroLineItemID }) => ({
        xeroLineItemID,
        email,
      }))
      .filter(id => Boolean(id))
  }, [registrants, replacementAudits])

  const go1LicensesLineItem = useMemo(() => {
    return invoice?.lineItems.find((li: XeroLineItem) => isGo1LicensesItem(li))
  }, [invoice])

  const promoCode = promoCodes.length ? promoCodes[0] : null
  const phone = invoice?.contact.phones?.find(
    (p: XeroPhone) => p?.phoneType === XeroPhoneType.Default,
  )

  const [discountAmount, discountLineItem] = useMemo(() => {
    const discountLineItem = invoice?.lineItems?.find((li: XeroLineItem) =>
      isDiscountLineItem(li),
    )

    return [discountLineItem?.lineAmount ?? 0, discountLineItem]
  }, [invoice?.lineItems])

  const processingFee = useMemo(() => {
    if (order?.paymentMethod !== Payment_Methods_Enum.Cc) {
      return 0
    }

    const processingFeeLineItem = invoice?.lineItems?.find((li: XeroLineItem) =>
      isProcessingFeeLineItem(li),
    )

    if (!processingFeeLineItem) {
      return 0
    }

    return processingFeeLineItem.unitAmount ?? 0
  }, [order?.paymentMethod, invoice?.lineItems])

  const xeroInvoiceUrl = useMemo(() => {
    if (invoice?.xeroId) {
      return `${
        import.meta.env.VITE_XERO_UI_ENDPOINT
      }/AccountsReceivable/Edit.aspx?InvoiceID=${invoice.xeroId}`
    }

    return null
  }, [invoice])

  const getRegistrantPostalAddress = useCallback(
    (registrant: OrderRegistrant) =>
      [
        registrant.addressLine1,
        registrant.addressLine2,
        registrant.city,
        registrant.postCode,
        registrant.country,
      ]
        .filter(Boolean)
        .join(', '),
    [],
  )

  const invoicedToInfo = useMemo(() => {
    return [
      <Typography component="span" key="contact-name">
        {order?.organization.name}
      </Typography>,
      order?.billingAddress ? ', ' : null,
      order?.billingAddress ? (
        <Typography
          component="span"
          key="contact-address"
          data-testid="contact-address"
        >
          {order.billingAddress}
        </Typography>
      ) : null,
    ].filter(Boolean)
  }, [order])

  const bookingContact = useMemo(() => {
    const course = courses?.length ? courses[0] : null

    if (course?.type === Course_Type_Enum.Open && order?.bookingContact) {
      return {
        fullName: `${order.bookingContact.firstName} ${order.bookingContact.lastName}`,
        email: order.bookingContact.email,
      }
    }

    if (course?.bookingContact) {
      return {
        fullName: course.bookingContact.fullName,
        email: course.bookingContact.email,
      }
    }

    if (course?.bookingContactInviteData) {
      return {
        fullName: `${course.bookingContactInviteData.firstName} ${course?.bookingContactInviteData.lastName}`,
        email: course.bookingContactInviteData.email,
      }
    }
  }, [courses, order?.bookingContact])

  const isInvoiceInXero = Boolean(xeroInvoiceUrl)

  const loadingData = fetching || isUsePromoCodesLoading

  const showRegistrants = useMemo(
    () =>
      courses?.some(
        course =>
          course?.type === Course_Type_Enum.Open &&
          course.deliveryType === Course_Delivery_Type_Enum.Virtual &&
          course.level === Course_Level_Enum.Level_1 &&
          registrants.length,
      ),
    [courses, registrants.length],
  )

  const expensesLineItems =
    isNotNullish(invoice) && isNotNullish(mainCourse)
      ? getTrainerExpensesLineItems(invoice.lineItems, mainCourse.level)
      : []

  if (!isUsePromoCodesLoading && !fetching && !(order && invoice)) {
    return <NotFound title={t('error')} description="" />
  }

  const status = invoice?.status as Xero_Invoice_Status_Enum
  const statusColor = INVOICE_STATUS_COLOR[status]

  const accountCode = registrantsLineItems.length
    ? registrantsLineItems[0].accountCode
    : go1LicensesLineItem?.accountCode

  const quantities = new Map<number, number>()

  data?.orders.forEach(order => {
    quantities.set(Number(order.course?.id), Number(order.quantity))
  })

  const getOldUserNameAndEmail = (
    lineItem: XeroLineItem & { lineItemID: string },
  ) => {
    //Search the registrant by xero line item id (will work for new orders)
    const registrantEmail = replacedRegistrants?.find(
      ({ xeroLineItemID }) => xeroLineItemID === lineItem.lineItemID,
    )?.email

    if (registrantEmail) {
      const oldUserByEmail = replacementAudits?.find(
        audit => audit?.payload?.inviteeEmail === registrantEmail,
      )
      if (oldUserByEmail) {
        return {
          oldUserFullName: oldUserByEmail?.profile.fullName,
          oldUserEmail: oldUserByEmail?.profile.email,
        }
      }
    }

    // For historic cases, search the registrant by name
    const oldUser = replacementAudits?.find(
      log =>
        lineItem?.description
          ?.trim()
          .toLocaleLowerCase()
          .includes(
            log?.payload?.inviteeFirstName
              ?.trim()
              .toLocaleLowerCase() as string,
          ) &&
        lineItem?.description
          ?.trim()
          .toLocaleLowerCase()
          .includes(
            log?.payload?.inviteeLastName?.trim().toLocaleLowerCase() as string,
          ),
    )
    return {
      oldUserFullName: oldUser?.profile.fullName,
      oldUserEmail: oldUser?.profile.email,
    }
  }

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Helmet>
        <title>{_t('pages.browser-tab-titles.orders.title')}</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {fetching ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="order-details-loading"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {order && !loadingData ? (
          <Box display="flex" paddingBottom={5}>
            <Box display="flex" flexDirection="column" pr={4}>
              <Sticky top={20}>
                <Box mb={4}>
                  <BackButton />
                </Box>
                <Typography variant="h2" mb={3}>
                  {t('title')}
                </Typography>
                <Typography variant="h2" mb={4}>
                  {order?.xeroInvoiceNumber}
                </Typography>
                {isInvoiceInXero && xeroInvoiceUrl ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    data-testid="order-details-view-in-xero-button"
                    href={xeroInvoiceUrl}
                    target="_blank"
                    aria-label={`${t('view-in-xero')} (${_t(
                      'opens-new-window',
                    )})`}
                  >
                    {t('view-in-xero')}
                  </Button>
                ) : null}
              </Sticky>
            </Box>

            <Container maxWidth="md">
              <Box>
                <Stack spacing="2px">
                  <DetailsItemBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack spacing={2} width={1}>
                      {courses?.map(course => {
                        const courseTimezone = course?.schedule.length
                          ? course?.schedule[0].timeZone
                          : undefined

                        const courseStart = new Date(
                          course?.dates.aggregate?.start?.date,
                        )
                        const courseEnd = new Date(
                          course?.dates.aggregate?.end?.date,
                        )
                        const timeZoneScheduleDateTime = () => {
                          if (!courseTimezone) return { courseStart, courseEnd }

                          return {
                            courseStart: utcToZonedTime(
                              courseStart,
                              courseTimezone,
                            ),
                            courseEnd: utcToZonedTime(
                              courseEnd,
                              courseTimezone,
                            ),
                          }
                        }
                        return (
                          <Box
                            key={uniqueId('course')}
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <CourseTitleAndDuration
                                showCourseLink
                                showCourseDuration={!residingCountryEnabled}
                                course={{
                                  id: Number(course?.id) ?? '',
                                  course_code: course?.course_code,
                                  ...(residingCountryEnabled
                                    ? {}
                                    : {
                                        start: courseStart,
                                        end: courseEnd,
                                      }),
                                  level:
                                    course?.level as unknown as Course_Level_Enum,
                                  reaccreditation: course?.reaccreditation,
                                  residingCountry: course?.residingCountry,
                                }}
                              />
                              {residingCountryEnabled ? (
                                <Typography
                                  data-testid={'order-timezone-info'}
                                  gutterBottom
                                  color="grey.700"
                                  width={'90%'}
                                >
                                  {_t('dates.withTime', {
                                    date: timeZoneScheduleDateTime()
                                      .courseStart,
                                  })}{' '}
                                  {formatGMTDateTimeByTimeZone(
                                    timeZoneScheduleDateTime().courseStart,
                                    courseTimezone,
                                    false,
                                  )}{' '}
                                  -{' '}
                                  {_t('dates.withTime', {
                                    date: timeZoneScheduleDateTime().courseEnd,
                                  })}{' '}
                                  {formatGMTDateTimeByTimeZone(
                                    timeZoneScheduleDateTime().courseEnd,
                                    courseTimezone,
                                    true,
                                  )}
                                </Typography>
                              ) : null}
                            </Box>
                            <Box textAlign="end" data-testid="'order-quantity'">
                              <Typography variant="caption">
                                {t('quantity')}
                              </Typography>
                              <Typography>
                                {course?.type === Course_Type_Enum.Indirect
                                  ? course.max_participants
                                  : (quantities.get(Number(course?.id)) ?? 0) +
                                    (cancellationAudits ?? []).filter(audit => {
                                      return audit.course_id === course?.id
                                    }).length}
                              </Typography>
                            </Box>
                          </Box>
                        )
                      })}
                      {go1LicensesLineItem ? (
                        <Typography color="grey.700">
                          {_t('currency', {
                            amount: go1LicensesLineItem.unitAmount,
                            currency: invoice?.currencyCode,
                          })}{' '}
                          {t('per-attendee')}
                        </Typography>
                      ) : null}
                    </Stack>
                  </DetailsItemBox>

                  {registrantsLineItems?.length ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        {registrantsLineItems?.map(
                          (lineItem, index: number) => (
                            <div
                              key={index}
                              data-testid={`order-registrant-box-${index}`}
                            >
                              <ItemRow
                                data-testid={`order-registrant-${index}`}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  gap: theme.spacing(2),
                                }}
                              >
                                <Box>
                                  <Typography color="grey.700">
                                    {lineItem.description}
                                  </Typography>
                                  {getOldUserNameAndEmail(lineItem)
                                    .oldUserEmail ? (
                                    <Typography color="error">
                                      {t('replaced-user', {
                                        oldUserFullName:
                                          getOldUserNameAndEmail(lineItem)
                                            .oldUserFullName,
                                        oldUserEmail:
                                          getOldUserNameAndEmail(lineItem)
                                            .oldUserEmail,
                                      })}
                                    </Typography>
                                  ) : null}
                                </Box>

                                <Typography color="grey.700">
                                  {_t('common.currency', {
                                    amount: lineItem?.unitAmount,
                                    currency: invoice?.currencyCode,
                                  })}
                                </Typography>
                              </ItemRow>
                              {cancelledRegistrantsLineItemIds.some(
                                item =>
                                  item.xeroLineItemID === lineItem.lineItemID,
                              ) ? (
                                <Typography color="error">Cancelled</Typography>
                              ) : null}
                            </div>
                          ),
                        )}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}
                  {registrants.some(
                    (registrant: CreateOrderParticipantInput) =>
                      registrant.postCode,
                  ) ? (
                    <DetailsItemBox data-testid="registrants-details">
                      <Stack spacing={2}>
                        {registrants.map((registrant, index: number) => {
                          const cancelled =
                            cancelledRegistrantsLineItemIds.some(
                              item => item.email === registrant.email,
                            )

                          const cancelledTypographyProps = cancelled
                            ? {
                                color: 'error',
                                sx: { textDecoration: 'line-through' },
                              }
                            : {}

                          if (getRegistrantPostalAddress(registrant)) {
                            return (
                              <ItemRow key={index}>
                                <Typography
                                  color="grey.700"
                                  {...cancelledTypographyProps}
                                >
                                  {` Address: ${getRegistrantPostalAddress(
                                    registrant,
                                  )}`}
                                </Typography>
                              </ItemRow>
                            )
                          } else return null
                        })}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}
                  {expensesLineItems.length ? (
                    <DetailsItemBox data-testid="expenses-row">
                      <Stack spacing={2}>
                        {expensesLineItems.map(expenseLineItem => (
                          <ItemRow
                            key={expenseLineItem?.itemCode}
                            data-testid={`line-item-${expenseLineItem?.itemCode}`}
                          >
                            <Typography color="grey.700">
                              {isMandatoryCourseMaterials(expenseLineItem)
                                ? t('mandatory-course-materials', {
                                    count: expenseLineItem?.quantity,
                                  })
                                : isFreeCourseMaterials(expenseLineItem)
                                ? t('free-course-materials', {
                                    count: expenseLineItem?.quantity,
                                  })
                                : expenseLineItem?.description}
                            </Typography>
                            <Typography color="grey.700">
                              {_t('common.currency', {
                                amount: expenseLineItem?.lineAmount,
                                currency: invoice?.currencyCode,
                              })}
                            </Typography>
                          </ItemRow>
                        ))}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      {promoCode ? (
                        <ItemRow data-testid="order-promo-code">
                          <Typography color="grey.700">
                            {t('promo-code', { code: promoCode.code })}
                          </Typography>
                          <Typography color="grey.700">
                            {_t('common.currency', {
                              amount: discountAmount,
                              currency: invoice?.currencyCode,
                            })}
                          </Typography>
                        </ItemRow>
                      ) : discountAmount &&
                        mainCourse?.type === Course_Type_Enum.Closed ? (
                        <ItemRow data-testid="free-spaces-row">
                          <Typography color="grey.700">
                            {t('free-spaces', {
                              amount: mainCourse.freeSpaces,
                            })}
                          </Typography>
                          <Typography
                            color="grey.700"
                            data-testid="free-spaces-discount"
                          >
                            {_t('common.currency', {
                              amount: discountLineItem?.lineAmount,
                              currency: invoice?.currencyCode,
                            })}
                          </Typography>
                        </ItemRow>
                      ) : null}
                      {processingFee > 0 ? (
                        <ItemRow data-testid="order-processing-fee">
                          <Typography color="grey.700">
                            {t('processing-fee')}
                          </Typography>
                          <Typography color="grey.700">
                            {_t('common.currency', {
                              amount: processingFee,
                              currency: invoice?.currencyCode,
                            })}
                          </Typography>
                        </ItemRow>
                      ) : null}
                      <ItemRow data-testid="order-subtotal">
                        <Typography color="grey.700">
                          {t('subtotal')}
                        </Typography>
                        <Typography color="grey.700">
                          {_t('common.currency', {
                            amount: invoice?.subtotal,
                            currency: invoice?.currencyCode,
                          })}
                        </Typography>
                      </ItemRow>
                      <ItemRow data-testid="order-vat">
                        <Typography color="grey.700">
                          {t(invoice?.totalTax ? 'vat' : 'no-vat')}
                        </Typography>
                        <Typography color="grey.700">
                          {_t('common.currency', {
                            amount: invoice?.totalTax,
                            currency: invoice?.currencyCode,
                          })}
                        </Typography>
                      </ItemRow>
                    </Stack>
                  </DetailsItemBox>

                  {mainCourse?.go1Integration ? (
                    <DetailsItemBox>
                      <ItemRow data-testid="licenses-redemeed">
                        <Typography color="grey.700">
                          {t('licenses-redeemed')}
                        </Typography>
                        <Typography color="grey.700">
                          {mainCourse?.max_participants}
                        </Typography>
                      </ItemRow>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <ItemRow data-testid="order-total">
                      <Typography color="grey.700">{t('total')}</Typography>
                      <Typography color="grey.700">
                        {_t('common.currency', {
                          amount: invoice?.total,
                          currency: invoice?.currencyCode,
                        })}
                      </Typography>
                    </ItemRow>
                  </DetailsItemBox>

                  {invoice?.status === Xero_Invoice_Status_Enum.Paid ? (
                    <DetailsItemBox>
                      <ItemRow data-testid="order-paid-on">
                        <Typography fontWeight={600}>
                          {t('paid-on', {
                            date: new Date(invoice?.fullyPaidOnDate as string),
                          })}
                        </Typography>
                        <Typography color="grey.700">
                          {_t('common.currency', {
                            amount: invoice?.amountPaid,
                            currency: invoice?.currencyCode,
                          })}
                        </Typography>
                      </ItemRow>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <ItemRow data-testid="order-amount-due">
                        <Typography fontWeight={600}>
                          {t('amount-due', {
                            currency: invoice?.currencyCode,
                          })}
                        </Typography>
                        <Typography fontWeight={600} variant="h3">
                          {_t('common.currency', {
                            amount: invoice?.amountDue,
                            currency: invoice?.currencyCode,
                          })}
                        </Typography>
                      </ItemRow>

                      <ItemRow data-testid="order-due-date">
                        <Typography
                          color={
                            status === Xero_Invoice_Status_Enum.Overdue
                              ? 'error.dark'
                              : 'grey.700'
                          }
                        >
                          {t('due-on', { date: invoice?.dueDate })}
                        </Typography>
                        <Chip
                          label={_t(
                            `common.filters.${invoice?.status ?? 'UNKNOWN'}`,
                          )}
                          color={statusColor}
                          size="small"
                        />
                      </ItemRow>
                    </Stack>
                  </DetailsItemBox>
                </Stack>
              </Box>

              <Box mt={4}>
                <Stack spacing="2px">
                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <ItemRow>
                        <Typography fontWeight={600}>
                          {t('date-reference')}
                        </Typography>
                      </ItemRow>
                      <ItemRow>
                        <Typography color="grey.700">
                          {_t('dates.default', { date: invoice?.issuedDate })}
                        </Typography>
                        <Typography color="grey.700">
                          {invoice?.reference}
                        </Typography>
                      </ItemRow>
                    </Stack>
                  </DetailsItemBox>

                  {accountCode ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>Account code</Typography>
                        <Typography color="grey.700">{accountCode}</Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {order.source && (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {_t('components.course-form.source-title')}
                        </Typography>
                        <Typography color="grey.700">
                          {_t(`course-sources.${order.source}`)}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  )}

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>
                        {t('payment-method')}
                      </Typography>
                      <Typography color="grey.700">
                        {t(`payment-method-${order?.paymentMethod}`)}
                      </Typography>
                    </Stack>
                  </DetailsItemBox>

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>
                        {t('ordered-by')}
                      </Typography>
                      <Typography color="grey.700">
                        {order.user.fullName}
                      </Typography>
                      <Typography color="grey.700">
                        {order.user.email}
                      </Typography>
                      {order.user.phone ? (
                        <Typography color="grey.700">
                          {order.user.phone}
                        </Typography>
                      ) : null}
                    </Stack>
                  </DetailsItemBox>

                  {bookingContact ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {_t('components.course-form.booking-contact')}
                        </Typography>
                        <Typography color="grey.700">
                          {bookingContact.fullName}
                        </Typography>
                        <Typography color="grey.700">
                          {bookingContact.email}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {order?.paymentMethod === Payment_Methods_Enum.Invoice ? (
                    <DetailsItemBox data-testid="order-invoiced-to">
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {t('invoiced-to')}
                        </Typography>
                        <Typography color="grey.700">
                          {acl.canViewOrganizations() ? (
                            <Link
                              href={`/organisations/${order.organizationId}`}
                              component={LinkBehavior}
                              underline="always"
                            >
                              {invoicedToInfo}
                            </Link>
                          ) : (
                            invoicedToInfo
                          )}
                        </Typography>
                        <Typography color="grey.700">
                          {order.billingGivenName} {order.billingFamilyName}
                        </Typography>
                        <Typography color="grey.700">
                          {order.billingEmail}
                        </Typography>
                        {phone ? (
                          <Typography color="grey.700">
                            {order.billingPhone}
                          </Typography>
                        ) : null}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}
                  {showRegistrants ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {t('registration')}
                        </Typography>
                        {registrants.map(registrant => {
                          if (getRegistrantPostalAddress(registrant)) {
                            const cancelled =
                              cancelledRegistrantsLineItemIds.some(
                                item => item.email === registrant.email,
                              )

                            const cancelledTypographyProps = cancelled
                              ? {
                                  color: 'error',
                                  sx: { textDecoration: 'line-through' },
                                }
                              : {}

                            return (
                              <Grid key={registrant.email}>
                                <Grid item>
                                  <Typography {...cancelledTypographyProps}>
                                    {getRegistrantPostalAddress(registrant)}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography {...cancelledTypographyProps}>
                                    {registrant.firstName} {registrant.lastName}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography {...cancelledTypographyProps}>
                                    {registrant.email}
                                  </Typography>
                                </Grid>
                              </Grid>
                            )
                          } else return null
                        })}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {mainCourse?.type === Course_Type_Enum.Closed &&
                  order.salesRepresentative?.fullName ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {t('sales-person')}
                        </Typography>
                        <Typography color="grey.700">
                          {order.salesRepresentative?.fullName}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {mainCourse?.source ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>{t('source')}</Typography>
                        <Typography>
                          {_t(`course-sources.${mainCourse.source}`)}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <Stack spacing={2} data-testid="region-info">
                      <Typography fontWeight={600}>{t('region')}</Typography>
                      <Typography color="grey.700">
                        {!isUKCountry(mainCourse?.residingCountry)
                          ? '-'
                          : t('UK')}
                      </Typography>
                    </Stack>
                  </DetailsItemBox>
                  {mainCourse?.residingCountry &&
                  !isUKCountry(mainCourse.residingCountry) ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {t('residing-country')}
                        </Typography>
                        <Typography color="grey.700">
                          {getLabel(mainCourse?.residingCountry)}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>{t('currency')}</Typography>
                      <Typography color="grey.700">
                        {t(invoice?.currencyCode ?? 'GBP')}
                      </Typography>
                    </Stack>
                  </DetailsItemBox>
                </Stack>
              </Box>
            </Container>
          </Box>
        ) : null}
      </Container>
    </FullHeightPageLayout>
  )
}
