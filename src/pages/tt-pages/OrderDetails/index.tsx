import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import { DetailsItemBox, ItemRow } from '@app/components/DetailsItemRow'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Payment_Methods_Enum,
  XeroAddressType,
  XeroPhone,
  XeroLineItem,
  XeroAddress,
  Xero_Invoice_Status_Enum,
  XeroPhoneType,
  CourseLevel,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useOrder } from '@app/hooks/useOrder'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { NotFound } from '@app/pages/common/NotFound'
import theme from '@app/theme'
import { INVOICE_STATUS_COLOR, isNotNullish } from '@app/util'

import {
  formatContactAddress,
  getTrainerExpensesLineItems,
  isDiscountLineItem,
  isGo1LicensesItem,
  isProcessingFeeLineItem,
  isRegistrantLineItem,
} from './utils'

export const OrderDetails: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const { t, _t } = useScopedTranslation('pages.order-details')
  const { acl } = useAuth()

  const [{ data, fetching }] = useOrder(id ?? '')

  const order = data?.order

  const { promoCodes, isLoading: isUsePromoCodesLoading } = usePromoCodes({
    sort: { by: 'code', dir: 'asc' },
    filters: { code: order?.promoCodes ?? [] },
    limit: order?.promoCodes?.length ?? 0,
    offset: 0,
  })

  const course = order?.course
  const invoice = order?.invoice

  const lineItemForRegistrants = useMemo(() => {
    return course?.name
      ? invoice?.lineItems?.find((li: XeroLineItem) =>
          isRegistrantLineItem(li, course.level)
        )
      : null
  }, [invoice, course])

  const go1LicensesLineItem = useMemo(() => {
    return invoice?.lineItems.find((li: XeroLineItem) => isGo1LicensesItem(li))
  }, [invoice])

  const promoCode = promoCodes.length ? promoCodes[0] : null
  const phone = invoice?.contact.phones?.find(
    (p: XeroPhone) => p?.phoneType === XeroPhoneType.Default
  )

  const address = invoice?.contact.addresses?.find(
    (address: XeroAddress) => address?.addressType === XeroAddressType.Pobox
  )

  const [discountAmount, discountLineItem] = useMemo(() => {
    const discountLineItem = invoice?.lineItems?.find((li: XeroLineItem) =>
      isDiscountLineItem(li)
    )

    return [discountLineItem?.lineAmount ?? 0, discountLineItem]
  }, [invoice?.lineItems])

  const processingFee = useMemo(() => {
    if (order?.paymentMethod !== Payment_Methods_Enum.Cc) {
      return 0
    }

    const processingFeeLineItem = invoice?.lineItems?.find((li: XeroLineItem) =>
      isProcessingFeeLineItem(li)
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

  const invoicedToInfo = useMemo(() => {
    return [
      <Typography component="span" key="contact-name">
        {invoice?.contact.name}
      </Typography>,
      address ? ', ' : null,
      address ? (
        <Typography
          component="span"
          key="contact-address"
          data-testid="contact-address"
        >
          {formatContactAddress(address)}
        </Typography>
      ) : null,
    ].filter(Boolean)
  }, [address, invoice?.contact.name])

  const source = lineItemForRegistrants?.tracking?.find(
    (tc: { name: string }) => tc.name === 'Sales Person'
  )?.option

  const isInvoiceInXero = Boolean(xeroInvoiceUrl)

  const loadingData = fetching || isUsePromoCodesLoading

  const expensesLineItems =
    isNotNullish(invoice) && isNotNullish(course)
      ? getTrainerExpensesLineItems(invoice.lineItems, course.level)
      : []

  if (!isUsePromoCodesLoading && !fetching && !(order && invoice)) {
    return <NotFound title={t('error')} description="" />
  }

  const status = invoice?.status as Xero_Invoice_Status_Enum
  const statusColor = INVOICE_STATUS_COLOR[status]

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
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
                    <Stack spacing={2}>
                      {course && (
                        <CourseTitleAndDuration
                          showCourseLink
                          course={{
                            id: course.id,
                            course_code: course.course_code,
                            start: course.start,
                            end: course.end,
                            level: course.level as unknown as CourseLevel,
                          }}
                        />
                      )}
                      {go1LicensesLineItem ? (
                        <Typography color="grey.700">
                          {_t('currency', {
                            amount: go1LicensesLineItem.unitAmount,
                          })}{' '}
                          {t('per-attendee')}
                        </Typography>
                      ) : null}
                    </Stack>
                    <Box textAlign="right" data-testid="order-quantity">
                      <Typography variant="caption">{t('quantity')}</Typography>
                      <Typography>{order.quantity}</Typography>
                    </Box>
                  </DetailsItemBox>

                  {order?.registrants?.length ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        {order?.registrants?.map((email: string) => (
                          <ItemRow
                            key={email}
                            data-testid={`order-registrant-${email}`}
                          >
                            <Typography color="grey.700">{email}</Typography>
                            <Typography color="grey.700">
                              {_t('common.currency', {
                                amount: lineItemForRegistrants?.unitAmount,
                              })}
                            </Typography>
                          </ItemRow>
                        ))}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {expensesLineItems.length ? (
                    <DetailsItemBox data-testid="expenses-row">
                      <Stack spacing={2}>
                        {expensesLineItems.map(expenseLineItem => (
                          <ItemRow key={expenseLineItem?.description}>
                            <Typography color="grey.700">
                              {expenseLineItem?.description}
                            </Typography>
                            <Typography color="grey.700">
                              {_t('common.currency', {
                                amount: expenseLineItem?.lineAmount,
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
                            })}
                          </Typography>
                        </ItemRow>
                      ) : discountAmount &&
                        course?.type === Course_Type_Enum.Closed ? (
                        <ItemRow data-testid="free-spaces-row">
                          <Typography color="grey.700">
                            {t('free-spaces', { amount: course.freeSpaces })}
                          </Typography>
                          <Typography
                            color="grey.700"
                            data-testid="free-spaces-discount"
                          >
                            {_t('common.currency', {
                              amount: discountLineItem?.lineAmount,
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
                            {_t('common.currency', { amount: processingFee })}
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
                          })}
                        </Typography>
                      </ItemRow>
                      <ItemRow data-testid="order-vat">
                        <Typography color="grey.700">{t('vat')}</Typography>
                        <Typography color="grey.700">
                          {_t('common.currency', {
                            amount: invoice?.totalTax,
                          })}
                        </Typography>
                      </ItemRow>
                    </Stack>
                  </DetailsItemBox>

                  <DetailsItemBox>
                    <ItemRow data-testid="order-total">
                      <Typography color="grey.700">{t('total')}</Typography>
                      <Typography color="grey.700">
                        {_t('common.currency', { amount: invoice?.total })}
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
                            `common.filters.${invoice?.status ?? 'UNKNOWN'}`
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
                          {invoice?.contact.firstName}{' '}
                          {invoice?.contact.lastName}
                        </Typography>
                        <Typography color="grey.700">
                          {invoice?.contact.emailAddress}
                        </Typography>
                        {phone ? (
                          <Typography color="grey.700">
                            {phone.phoneNumber}
                          </Typography>
                        ) : null}
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {course?.type === Course_Type_Enum.Closed &&
                  course?.salesRepresentative?.fullName ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>
                          {t('sales-person')}
                        </Typography>
                        <Typography color="grey.700">
                          {course?.salesRepresentative?.fullName}
                        </Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  {source ? (
                    <DetailsItemBox>
                      <Stack spacing={2}>
                        <Typography fontWeight={600}>{t('source')}</Typography>
                        <Typography>{source}</Typography>
                      </Stack>
                    </DetailsItemBox>
                  ) : null}

                  <DetailsItemBox>
                    <Stack spacing={2}>
                      <Typography fontWeight={600}>{t('region')}</Typography>
                      <Typography color="grey.700">{t('UK')}</Typography>
                    </Stack>
                  </DetailsItemBox>

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
    </FullHeightPage>
  )
}
