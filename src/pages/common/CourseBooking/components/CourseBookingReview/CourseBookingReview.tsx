import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { differenceInDays, isPast, subDays } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { useAuth } from '@app/context/auth'
import { PaymentMethod } from '@app/generated/graphql'

import { useBooking } from '../BookingContext'

const InfoRow: React.FC<{ label: React.ReactNode; value: React.ReactNode }> = ({
  label,
  value = '',
}) => (
  <Box display="flex" justifyContent="space-between" mb={1}>
    <Typography color="grey.700">{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
)
export const CourseBookingReview: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { course, booking, amounts, placeOrder } = useBooking()

  const [accept, setAccept] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmBooking = async () => {
    setCreatingOrder(true)

    try {
      const order = await placeOrder()
      setCreatingOrder(false)

      console.log(order)

      if (!order) {
        setError(t('pages.book-course.error-creating-order'))
        return
      }

      if (booking.paymentMethod === PaymentMethod.Cc) {
        navigate(`../payment/${order.id}`, { replace: true })
      } else {
        navigate(`../done?order_id=${order.id}`, { replace: true })
      }
    } catch (err) {
      if ((err as Error)?.message?.includes('Promo codes not applicable')) {
        const invalidPromoCodes = (err as Error).message
          .split(': ')[1]
          .split(',')

        let codes = `${invalidPromoCodes[0]}`
        invalidPromoCodes.slice(1).forEach(code => {
          codes = `${codes}, ${code}`
        })
        setError(t('pages.book-course.promo-codes-not-applicable', { codes }))
      }

      console.error(err)
      setCreatingOrder(false)
      setError(t('pages.book-course.error-creating-order'))
    }
  }

  const INVOICE_DUE_OFFSET_DAYS = 8 * 7
  const calculateDueDate = (date: Date) => {
    return Math.abs(differenceInDays(new Date(), date)) <
      INVOICE_DUE_OFFSET_DAYS || isPast(date)
      ? t('pages.book-course.due-immediately')
      : t('pages.book-course.due-on', {
          date: subDays(date, INVOICE_DUE_OFFSET_DAYS),
        })
  }

  const formatCurrency = (amount: number) => {
    return t('currency', { amount, currency: booking.currency })
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.book-course.confirm-title')}
      </Typography>

      {error ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2, mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Box bgcolor="common.white" p={2} mb={1}>
        <Typography gutterBottom fontWeight="600">
          {t('pages.book-course.your-info')}
        </Typography>

        <InfoRow label={t('first-name')} value={profile?.givenName} />
        <InfoRow label={t('last-name')} value={profile?.familyName} />
        <InfoRow label={t('email')} value={profile?.email} />
        <InfoRow label={t('work-phone')} value={profile?.phone} />
      </Box>

      <Box bgcolor="common.white" p={2} mb={3}>
        <Typography gutterBottom fontWeight="600">
          {t('pages.book-course.order-summary')}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography gutterBottom fontWeight="600">
              {course.name}
            </Typography>
            <Typography gutterBottom color="grey.700">
              {t('start')}:{' '}
              {t('dates.withTime', {
                date: course.dates.aggregate.start.date,
              })}
            </Typography>
            <Typography color="grey.700">
              {t('end')}:{' '}
              {t('dates.withTime', {
                date: course.dates.aggregate.end.date,
              })}
            </Typography>
          </Box>
          <Stack alignItems="flex-end">
            <Typography variant="caption" gutterBottom color="grey.700">
              {t('qty')}
            </Typography>
            <Typography>{booking.quantity}</Typography>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom fontWeight="600">
          {t('pages.book-course.payment-method')}
        </Typography>
        <Typography color="grey.700">
          {booking.paymentMethod === PaymentMethod.Cc
            ? t('pages.book-course.pay-by-cc')
            : null}
          {booking.paymentMethod === PaymentMethod.Invoice
            ? t('pages.book-course.pay-by-inv')
            : null}
        </Typography>
        {booking.paymentMethod === PaymentMethod.Invoice && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom fontWeight="600">
              {t('invoice-contact')}
            </Typography>
            <InfoRow
              label={t('pages.book-course.billing-address')}
              value={booking.invoiceDetails?.billingAddress}
            />
            <InfoRow
              label={t('first-name')}
              value={booking.invoiceDetails?.firstName}
            />
            <InfoRow
              label={t('last-name')}
              value={booking.invoiceDetails?.surname}
            />
            <InfoRow
              label={t('work-email')}
              value={booking.invoiceDetails?.email}
            />
            <InfoRow label={t('phone')} value={booking.invoiceDetails?.phone} />
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom fontWeight="600">
          {t('registrants')}
        </Typography>
        {booking.emails.map(email => (
          <Box key={email} display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">{email}</Typography>
            <Typography color="grey.700">
              {t('currency', {
                amount: booking.price,
                currency: booking.currency,
              })}
            </Typography>
          </Box>
        ))}
        {booking.trainerExpenses > 0 ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('pages.book-course.trainer-expenses')}
            </Typography>
            <Typography color="grey.700">
              {formatCurrency(amounts.trainerExpenses)}
            </Typography>
          </Box>
        ) : null}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('subtotal')}</Typography>
          <Typography color="grey.700">
            {formatCurrency(amounts.subtotal)}
          </Typography>
        </Box>
        {booking.promoCodes.map(code => (
          <Box key={code} display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('promo-code')}: {code}
            </Typography>
            <Typography color="grey.700">
              -{' '}
              {t('currency', {
                amount: booking.discounts[code]?.amountCurrency,
              })}
            </Typography>
          </Box>
        ))}
        {booking.freeSpaces > 0 ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('pages.book-course.free-spaces')}
            </Typography>
            <Typography color="grey.700">
              {formatCurrency(-amounts.freeSpacesDiscount)}
            </Typography>
          </Box>
        ) : null}
        {amounts.paymentProcessingFee > 0 ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('pages.book-course.payment-processing-fee')}
            </Typography>
            <Typography color="grey.700">
              {formatCurrency(amounts.paymentProcessingFee)}
            </Typography>
          </Box>
        ) : null}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">
            {t('vat')} ({booking.vat}%)
          </Typography>
          <Typography color="grey.700">
            {formatCurrency(amounts.vat)}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="500">
            {t('amount-due')} ({booking.currency})
          </Typography>
          <Typography fontWeight="500">
            {formatCurrency(amounts.total)}
          </Typography>
        </Box>
        <Typography color="grey.700">
          {calculateDueDate(new Date(course.dates.aggregate.start.date))}
        </Typography>
      </Box>

      <FormControlLabel
        sx={{
          alignItems: 'flex-start',
          '& .MuiCheckbox-root': { paddingY: 0 },
        }}
        control={
          <Checkbox
            onChange={(_, checked) => setAccept(checked)}
            checked={accept}
          />
        }
        label={
          <Typography variant="body2">
            {t('pages.book-course.review-tnc')}
          </Typography>
        }
      />

      <Box display="flex" justifyContent="space-between" mt={0}>
        <BackButton label={t('pages.book-course.back-to-booking')} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmBooking}
          disabled={!accept || creatingOrder}
        >
          {t('pages.book-course.complete-booking')}
        </Button>
      </Box>
    </Box>
  )
}
