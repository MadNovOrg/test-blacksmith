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

import { useBooking } from '../BookingContext'

export const CourseBookingReview: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { course, booking, totalPrice } = useBooking()

  const [accept, setAccept] = useState(false)

  const handleConfirmBooking = () => {
    // TODO: payment, insert order, etc
    navigate('../done')
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

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('first-name')}</Typography>
          <Typography>Salman</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('last-name')}</Typography>
          <Typography>Mitha</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('email')}</Typography>
          <Typography>salman.mitha@nearform.com</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('work-phone')}</Typography>
          <Typography>+44 123456789</Typography>
        </Box>
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
              {t('dates.long', {
                date: course.dates.aggregate.start.date,
              })}
            </Typography>
            <Typography color="grey.700">
              {t('dates.timeFromTo', {
                from: course.dates.aggregate.start.date,
                to: course.dates.aggregate.end.date,
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
          {t('pages.book-course.pay-by-cc')}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom fontWeight="600">
          {t('registrants')}
        </Typography>

        {booking.emails.map(email => (
          <Box key={email} display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">{email}</Typography>
            <Typography color="grey.700">
              {t('currency', { amount: booking.price })}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('subtotal')}</Typography>
          <Typography color="grey.700">
            {t('currency', { amount: booking.price * booking.emails.length })}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">
            {t('vat')} ({booking.vat}%)
          </Typography>
          <Typography color="grey.700">
            {t('currency', {
              amount:
                (booking.price * booking.emails.length * booking.vat) / 100,
            })}
          </Typography>
        </Box>
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
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="500">{t('amount-due')} (GBP)</Typography>
          <Typography fontWeight="500">
            {t('currency', { amount: totalPrice })}
          </Typography>
        </Box>
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
        >
          {t('pages.book-course.complete-booking')}
        </Button>
      </Box>
    </Box>
  )
}
