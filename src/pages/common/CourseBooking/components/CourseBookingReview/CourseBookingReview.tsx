import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import Big from 'big.js'
import { isPast } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { useAuth } from '@app/context/auth'
import { PaymentMethod } from '@app/generated/graphql'
import { CourseType } from '@app/types'
import {
  formatCourseVenue,
  formatCurrency,
  getOrderDueDate,
  isOrderDueDateImmediate,
} from '@app/util'

import { useBooking } from '../BookingContext'

const InfoRow: React.FC<
  React.PropsWithChildren<{ label: React.ReactNode; value: React.ReactNode }>
> = ({ label, value = '' }) => (
  <Box display="flex" justifyContent="space-between" mb={1}>
    <Typography color="grey.700">{label}</Typography>
    <Typography>{value}</Typography>
  </Box>
)
export const CourseBookingReview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, acl } = useAuth()
  const { course, booking, amounts, placeOrder } = useBooking()

  const [accept, setAccept] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmBooking = async () => {
    setCreatingOrder(true)

    try {
      const order = await placeOrder()
      setCreatingOrder(false)

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

      setCreatingOrder(false)
      setError(t('pages.book-course.error-creating-order'))
    }
  }

  const calculateDueDate = (date: Date) => {
    const today = new Date()
    return isOrderDueDateImmediate(today, date, booking.paymentMethod) ||
      isPast(date)
      ? t('pages.book-course.due-immediately')
      : t('pages.book-course.due-on', {
          date: getOrderDueDate(today, date, booking.paymentMethod),
        })
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
            <Typography gutterBottom color="grey.700">
              {t('end')}:{' '}
              {t('dates.withTime', {
                date: course.dates.aggregate.end.date,
              })}
            </Typography>

            <Typography color="grey.700">
              {t('pages.book-course.venue')}:{' '}
              {formatCourseVenue(course.deliveryType, course.schedule[0].venue)}
            </Typography>
          </Box>
          <Stack alignItems="flex-end">
            <Typography variant="caption" gutterBottom color="grey.700">
              {t('qty')}
            </Typography>
            <Typography>{booking.quantity}</Typography>
          </Stack>
        </Box>
        {acl.canInviteAttendees(CourseType.OPEN) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom fontWeight="600">
              {t('booking-details')}
            </Typography>
            <InfoRow
              label={t('components.course-form.source-title')}
              value={t(`course-sources.${booking.source}`)}
            />
            {booking.salesRepresentative ? (
              <InfoRow
                label={t('components.course-form.sales-rep-placeholder')}
                value={booking.salesRepresentative?.fullName}
              />
            ) : null}
            {booking.bookingContact ? (
              <InfoRow
                label={t('components.course-form.booking-contact')}
                value={
                  booking.bookingContact?.firstName +
                  ' ' +
                  booking.bookingContact?.lastName
                }
              />
            ) : null}
          </>
        )}
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
        {booking.participants.map(participant => (
          <Box
            key={participant.email}
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography color="grey.700">
              {participant.firstName} {participant.lastName} {participant.email}
            </Typography>
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
              {formatCurrency(
                { amount: new Big(amounts.trainerExpenses).round().toNumber() },
                t
              )}
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
              {formatCurrency(
                {
                  amount: new Big(amounts.freeSpacesDiscount)
                    .neg()
                    .round()
                    .toNumber(),
                },
                t
              )}
            </Typography>
          </Box>
        ) : null}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('subtotal')}</Typography>
          <Typography color="grey.700">
            {formatCurrency(
              {
                amount: new Big(amounts.subtotalDiscounted).round().toNumber(),
              },
              t
            )}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">
            {t('custom-vat', { amount: booking.vat })}
          </Typography>
          <Typography color="grey.700">
            {formatCurrency(
              { amount: new Big(amounts.vat).round().toNumber() },
              t
            )}
          </Typography>
        </Box>
        {amounts.paymentProcessingFee > 0 ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('pages.book-course.payment-processing-fee')}
            </Typography>
            <Typography color="grey.700">
              {formatCurrency(
                {
                  amount: new Big(amounts.paymentProcessingFee)
                    .round()
                    .toNumber(),
                },
                t
              )}
            </Typography>
          </Box>
        ) : null}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="500">
            {t('amount-due')} ({booking.currency})
          </Typography>
          <Typography fontWeight="500">
            {formatCurrency(
              { amount: new Big(amounts.total).round().toNumber() },
              t
            )}
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
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleConfirmBooking}
          disabled={!accept}
          loading={creatingOrder}
        >
          {t('pages.book-course.complete-booking')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
