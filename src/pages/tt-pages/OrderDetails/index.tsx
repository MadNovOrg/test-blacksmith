import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Button,
  Typography,
} from '@mui/material'
import { addWeeks, parseISO } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { DetailsRow } from '@app/components/DetailsRow'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import {
  XeroPhone,
  XeroAddress,
  XeroInvoiceStatus,
  Promo_Code_Type_Enum,
  Payment_Methods_Enum,
} from '@app/generated/graphql'
import { useOrder } from '@app/hooks/useOrder'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { NotFound } from '@app/pages/common/NotFound'
import theme from '@app/theme'
import { xeroInvoiceStatusColors } from '@app/util'

interface Stringifiable {
  toString(): string
}

type RowProps = {
  label?: Stringifiable
  value?: Stringifiable
  labelProps?: { [key: string]: Stringifiable }
  valueProps?: { [key: string]: Stringifiable }
}

const Row: React.FC<RowProps> = ({ label, value, labelProps, valueProps }) => (
  <DetailsRow
    label={String(label) ?? ''}
    value={String(value) ?? ''}
    labelProps={{
      flex: null,
      textAlign: 'left',
      color: theme.typography.body2.color,
      ...(labelProps ?? {}),
    }}
    valueProps={{
      flex: null,
      textAlign: 'right',
      color: theme.typography.body2.color,
      ...(valueProps ?? {}),
    }}
    containerProps={{
      justifyContent: 'space-between',
    }}
  />
)

const add8Weeks = (dateStr: string) => addWeeks(parseISO(dateStr), 8)

export const OrderDetails: React.FC<unknown> = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const _t = useCallback(
    (n: string, ...rest) => t(`pages.order-details.${n}`, ...rest),
    [t]
  )

  const { order, error, course, invoice, isLoading } = useOrder(id ?? '')

  const { promoCodes, isLoading: isUsePromoCodesLoading } = usePromoCodes({
    sort: { by: 'code', dir: 'asc' },
    filters: { code: order?.promoCodes ?? [] },
    limit: order?.promoCodes?.length ?? 0,
    offset: 0,
  })

  const lineItemForRegistrants = useMemo(() => {
    return course?.name
      ? invoice?.lineItems?.find(li =>
          li?.description?.includes(t(`course-levels.${course.level}`))
        )
      : null
  }, [invoice, course, t])

  const getDiscountForPromoCode = useCallback(
    (total: number, code: string, quantity = 1) => {
      const promoCode = promoCodes?.find(pc => pc?.code === code)
      if (!promoCode) {
        return 0
      }

      let discount = 0
      switch (promoCode.type) {
        case Promo_Code_Type_Enum.FreePlaces:
          discount = -(promoCode.amount / quantity) * total
          break

        case Promo_Code_Type_Enum.Percent:
          discount = -(promoCode.amount / 100) * total
          break

        default:
          break
      }

      return discount
    },
    [promoCodes]
  )

  const formatPhoneString = (phone: XeroPhone | null) =>
    phone
      ? `${phone.phoneCountryCode ? `(+${phone.phoneCountryCode})` : ''} \
${phone.phoneAreaCode} ${phone.phoneNumber}`
      : ''

  const getOrderedByValue = useCallback(() => {
    const phone = invoice?.contact?.phones ? invoice.contact.phones[0] : {}
    const formattedPhoneString = formatPhoneString(phone)

    let result = invoice?.contact?.name ?? ''
    if (invoice?.contact?.emailAddress) {
      result += `\n${invoice.contact.emailAddress}`
    }
    if (phone) {
      result += `\n${formattedPhoneString}`
    }

    return result
  }, [invoice])

  const getInvoicedToValue = useCallback(() => {
    let result = ''
    if (invoice?.contact?.addresses && invoice?.contact?.addresses.length > 0) {
      const { addressLine1, addressLine2, city, region, postalCode, country } =
        invoice?.contact?.addresses[0] as XeroAddress
      result += `${addressLine1}, ${city}, ${region}, ${country}
${addressLine2}
${postalCode}
${invoice?.contact?.name}`
    }

    result += `\n${invoice?.contact?.emailAddress}`

    if (invoice?.contact?.addresses && invoice?.contact?.addresses.length > 0) {
      const phone = invoice?.contact?.phones ? invoice.contact.phones[0] : {}
      result += `\n${formatPhoneString(phone)}`
    }

    return result
  }, [invoice])

  const processingFee = useMemo(() => {
    if (order?.paymentMethod !== Payment_Methods_Enum.Cc) {
      return 0
    }

    const processingFeeLineItem = invoice?.lineItems?.find(
      li => li?.itemCode === 'CREDIT CARD FEE'
    )
    if (!processingFeeLineItem) {
      return 0
    }

    return processingFeeLineItem.unitAmount ?? 0
  }, [order?.paymentMethod, invoice?.lineItems])

  const xeroInvoiceUrl = useMemo(() => {
    if (invoice?.invoiceID) {
      return `${
        import.meta.env.VITE_XERO_UI_ENDPOINT
      }/AccountsReceivable/Edit.aspx?InvoiceID=${invoice.invoiceID}`
    }

    return null
  }, [invoice])

  const handleOpenInXeroClick = useCallback(() => {
    if (xeroInvoiceUrl) {
      window.open(xeroInvoiceUrl, '_blank')?.focus()
    }
  }, [xeroInvoiceUrl])

  if (!isUsePromoCodesLoading && !isLoading && !(order && invoice)) {
    return <NotFound />
  }

  const localizedDateString = new Date(invoice?.date as string).toLocaleString(
    _t('locale'),
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short',
    }
  )

  const status = invoice?.status ?? 'UNKNOWN'
  const statusColors = xeroInvoiceStatusColors[status]

  const dueDate = invoice?.dueDate ?? add8Weeks(invoice?.date as string)

  const isInvoiceInXero = Boolean(xeroInvoiceUrl)

  const loadingData = isLoading || isUsePromoCodesLoading

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {isLoading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="order-details-loading"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {error ? <Alert severity="error">{_t('error')}</Alert> : null}

        {order && !loadingData ? (
          <Box display="flex" paddingBottom={5}>
            <Box display="flex" flexDirection="column" pr={4}>
              <Sticky top={20}>
                <Box mb={4}>
                  <BackButton label={_t('back-button-label')} to="/orders" />
                </Box>
                <Typography variant="h2" mb={3}>
                  {_t('title')}
                </Typography>
                <Typography variant="h2" mb={4}>
                  {order?.xeroInvoiceNumber}
                </Typography>
                {isInvoiceInXero ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    data-testid="order-details-view-in-xero-button"
                    onClick={handleOpenInXeroClick}
                  >
                    {_t('view-in-xero')}
                  </Button>
                ) : null}
              </Sticky>
            </Box>

            <Container maxWidth="md">
              <Box mt={2} display="flex" flexDirection="column">
                <Box p={2} bgcolor="common.white">
                  <Row
                    label={`${course?.name} ${
                      course?.course_code && `(${course?.course_code})`
                    }}`}
                    value={_t('quantity')}
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                    valueProps={{ variant: 'caption', fontWeight: 600 }}
                  />
                  <Row label={localizedDateString} value={order?.quantity} />
                </Box>

                {order?.registrants?.length ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    {order?.registrants?.map((email: string) => (
                      <Row
                        key={email}
                        label={email}
                        value={t('common.currency', {
                          amount: lineItemForRegistrants?.unitAmount,
                        })}
                      />
                    ))}
                  </Box>
                ) : null}

                {!order?.registrants?.length ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    {invoice?.lineItems?.map(lineItem => {
                      const unitAmount = t('common.currency', {
                        amount: lineItem?.unitAmount,
                      })

                      const lineAmount = t('common.currency', {
                        amount: lineItem?.lineAmount,
                      })

                      const lineItemTotal = `${unitAmount} x ${lineItem?.quantity} = ${lineAmount}`

                      return (
                        <Row
                          key={lineItem?.item?.id}
                          label={lineItem?.description ?? ''}
                          value={lineItemTotal}
                        />
                      )
                    })}
                  </Box>
                ) : null}

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  {processingFee > 0 ? (
                    <Row
                      label={_t('processing-fee')}
                      value={t('common.currency', { amount: processingFee })}
                    />
                  ) : null}
                  <Row
                    label={_t('subtotal')}
                    value={t('common.currency', {
                      amount: invoice?.subTotal,
                    })}
                  />
                  <Row
                    label={_t('vat')}
                    value={t('common.currency', {
                      amount: invoice?.totalTax,
                    })}
                  />
                </Box>

                {order?.promoCodes?.length > 0 ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    {order.promoCodes.map((code: string) => (
                      <Row
                        key={code}
                        label={_t('promo-code', { code })}
                        value={t('common.currency', {
                          amount: getDiscountForPromoCode(
                            order?.orderTotal,
                            code,
                            order?.quantity
                          ),
                        })}
                      />
                    ))}
                  </Box>
                ) : null}

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('total')}
                    value={t('common.currency', { amount: invoice?.total })}
                  />
                </Box>

                {invoice?.status === XeroInvoiceStatus.Paid ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    <Row
                      label={_t('paid-on', {
                        date: new Date(invoice?.fullyPaidOnDate as string),
                      })}
                      value={t('common.currency', {
                        amount: invoice?.amountPaid,
                      })}
                      labelProps={{ fontWeight: 600 }}
                      valueProps={{ fontWeight: 600 }}
                    />
                  </Box>
                ) : null}

                <Box p={2} bgcolor="common.white" mt={4}>
                  <Row
                    label={_t('amount-due', {
                      currency: invoice?.currencyCode,
                    })}
                    value={t('common.currency', { amount: invoice?.amountDue })}
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                    valueProps={{ variant: 'h3' }}
                  />
                  <Row
                    label={_t('due-on', { date: dueDate })}
                    value={t(`common.filters.${invoice?.status ?? 'UNKNOWN'}`)}
                    valueProps={{
                      variant: 'caption',
                      fontWeight: 600,
                      color: statusColors[0],
                      backgroundColor: statusColors[1],
                      padding: '0.125rem 0.5rem',
                      borderRadius: '1rem',
                    }}
                  />
                </Box>

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('date-reference')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row
                    label={t('dates.default', { date: invoice?.date })}
                    value=""
                  />
                </Box>

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('payment-method')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row
                    label={`Pay by ${_t(
                      `payment-method-${order?.paymentMethod}`
                    )}`}
                    value=""
                  />
                </Box>

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('ordered-by')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row label={getOrderedByValue()} value="" />
                </Box>

                {order?.paymentMethod === Payment_Methods_Enum.Invoice ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    <Row
                      label={_t('invoiced-to')}
                      value=""
                      labelProps={{
                        variant: 'body1',
                        fontWeight: 600,
                        color: 'inherit',
                      }}
                    />
                    <Row label={getInvoicedToValue()} value="" />
                  </Box>
                ) : null}

                {course?.type === 'CLOSED' &&
                course?.salesRepresentative?.fullName ? (
                  <Box p={2} bgcolor="common.white" mt={0.3}>
                    <Row
                      label={_t('sales-person')}
                      value=""
                      labelProps={{
                        variant: 'body1',
                        fontWeight: 600,
                        color: 'inherit',
                      }}
                    />
                    <Row
                      label={course?.salesRepresentative?.fullName}
                      value=""
                    />
                  </Box>
                ) : null}

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('source')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row label={_t('mailout')} value="" />
                </Box>

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('region')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row label={_t('UK')} value="" />
                </Box>

                <Box p={2} bgcolor="common.white" mt={0.3}>
                  <Row
                    label={_t('currency')}
                    value=""
                    labelProps={{
                      variant: 'body1',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  />
                  <Row label={_t(invoice?.currencyCode ?? 'GBP')} value="" />
                </Box>
              </Box>
            </Container>
          </Box>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
