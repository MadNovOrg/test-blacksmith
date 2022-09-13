import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { useAuth } from '@app/context/auth'
import { PaymentMethod } from '@app/types'

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

  const handleConfirmBooking = async () => {
    const order = await placeOrder()
    if (booking.paymentMethod === PaymentMethod.CC) {
      navigate(`../payment/${order.id}`, { replace: true })
    } else {
      navigate(`../done?order_id=${order.id}`, { replace: true })
    }
  }

  const formatCurrency = (amount: number) => {
    return t('currency', { amount, currency: booking.currency })
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.book-course.confirm-title')}
      </Typography>
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
          {booking.paymentMethod === PaymentMethod.CC
            ? t('pages.book-course.pay-by-cc')
            : null}
          {booking.paymentMethod === PaymentMethod.INVOICE
            ? t('pages.book-course.pay-by-inv')
            : null}
        </Typography>
        {booking.paymentMethod === PaymentMethod.INVOICE && (
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
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('subtotal')}</Typography>
          <Typography color="grey.700">
            {formatCurrency(amounts.subtotal)}
          </Typography>
        </Box>
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
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">
            {t('vat')} ({booking.vat}%)
          </Typography>
          <Typography color="grey.700">
            {formatCurrency(amounts.vat)}
          </Typography>
        </Box>
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
        {booking.promoCodes.map(code => (
          <Box key={code} display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('promo-code')}: {code}
            </Typography>
            <Typography color="grey.700">
              - {t('currency', { amount: 2 })}
            </Typography>
          </Box>
        ))}
        {booking.promoCodes.length ? <Divider sx={{ my: 2 }} /> : null}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="500">
            {t('amount-due')} ({booking.currency})
          </Typography>
          <Typography fontWeight="500">
            {formatCurrency(amounts.total)}
          </Typography>
        </Box>
        <Typography color="grey.700">
          {t('pages.book-course.due-on', { date: new Date('1980-01-01') })}
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

      <Box display="flex" justifyContent="space-between" mt={4}>
        <BackButton label={t('pages.book-course.back-to-booking')} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmBooking}
          disabled={!accept}
        >
          {t('pages.book-course.complete-booking')}
        </Button>
      </Box>
    </Box>
  )
}
