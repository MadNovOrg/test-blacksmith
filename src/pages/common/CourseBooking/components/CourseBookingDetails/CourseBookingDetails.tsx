import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useBooking } from '../BookingContext'
import { PromoCode } from '../PromoCode'

export const CourseBookingDetails: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    course,
    availableSeats,
    booking,
    totalPrice,
    addPromo,
    removePromo,
    setBooking,
  } = useBooking()
  const [qty, setQty] = useState(booking.quantity)
  const [emails, setEmails] = useState<string[]>(booking.emails)

  const qtyOptions = useMemo(
    () => Array.from({ length: availableSeats }, (_, i) => i + 1),
    [availableSeats]
  )

  const handleAddEmail = (_: unknown, v: string[]) => {
    // TODO: validate email
    setEmails(v)
  }

  const handleNext = () => {
    setBooking({ emails, quantity: qty })
    navigate('../review')
  }

  const isValid = emails.length === qty

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.book-course.order-details')}
      </Typography>

      <Box bgcolor="common.white" p={2} mb={4}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Typography gutterBottom fontWeight="600">
              {course.name}
            </Typography>
            <Typography gutterBottom color="grey.700">
              {t('dates.long', {
                date: course.dates.aggregate.start.date,
              })}
            </Typography>
            <Typography gutterBottom color="grey.700">
              {t('dates.timeFromTo', {
                from: course.dates.aggregate.start.date,
                to: course.dates.aggregate.end.date,
              })}
            </Typography>
          </Box>
          <Box minWidth={100} display="flex" alignItems="center" mr={-2}>
            <FormControl fullWidth sx={{ bgcolor: 'grey.200' }}>
              <InputLabel variant="standard" htmlFor="qty-select">
                {t('qty')}
              </InputLabel>
              <NativeSelect
                defaultValue={qty}
                inputProps={{ name: 'qty', id: 'qty-select' }}
                onChange={e => setQty(+e.target.value)}
              >
                {qtyOptions.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <IconButton aria-label="delete" onClick={() => console.log('TBD')}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">{t('subtotal')}</Typography>
          <Typography color="grey.700">
            {t('currency', { amount: booking.price })}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="grey.700">
            {t('vat')} ({booking.vat}%)
          </Typography>
          <Typography color="grey.700">
            {t('currency', { amount: (booking.price * booking.vat) / 100 })}
          </Typography>
        </Box>

        <Box my={2}>
          <PromoCode
            codes={booking.promoCodes}
            onAdd={addPromo}
            onRemove={removePromo}
          />
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="500" color="primary">
            {t('amount-due')} (GBP)
          </Typography>
          <Typography fontWeight="500" color="primary">
            {t('currency', { amount: totalPrice })}
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" fontWeight="500">
        {t('registration')}
      </Typography>
      <Box bgcolor="common.white" p={2} mb={4}>
        <Autocomplete
          multiple
          id="emails"
          options={[] as string[]}
          value={emails}
          freeSolo
          onChange={handleAddEmail}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              // disable key rule because getTagProps already sets correct key
              // eslint-disable-next-line react/jsx-key
              <Chip
                variant="filled"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              label={t('enter-emails')}
              placeholder={t('emails')}
              inputProps={{ ...params.inputProps, sx: { height: 40 } }}
              sx={{ bgcolor: 'grey.100' }}
            />
          )}
        />
        <Box display="flex" justifyContent="space-between">
          <FormHelperText>
            {emails.length} / {qty}
          </FormHelperText>
          {emails.length > qty && (
            <FormHelperText error>
              {t('validation-errors.max-registrants', { num: qty })}
            </FormHelperText>
          )}
        </Box>

        <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
          <b>{t('important')}:</b> {t('pages.book-course.notice')}
        </Alert>
      </Box>

      <Typography variant="subtitle1" fontWeight="500">
        {t('pages.book-course.payment-details')}
      </Typography>
      <Box bgcolor="common.white" p={2} mb={4}>
        <FormControl
          sx={{
            '& .MuiRadio-root': {
              paddingY: 0,
            },

            '& .MuiFormControlLabel-root': {
              alignItems: 'flex-start',
              mb: 2,
            },
          }}
        >
          <FormLabel id="payment-method" sx={{ mb: 2, fontWeight: '600' }}>
            {t('pages.book-course.payment-method')}
          </FormLabel>
          <RadioGroup
            aria-labelledby="payment-method"
            name="controlled-radio-buttons-group"
            value={'cc'}
            onChange={() => console.log('TBD')}
          >
            <FormControlLabel
              value="cc"
              control={<Radio />}
              label={
                <Box>
                  <Typography gutterBottom fontWeight="500">
                    {t('pages.book-course.pay-by-cc')}
                  </Typography>
                  <Typography variant="body2" color="grey.700">
                    {t('pages.book-course.pay-by-cc-info')}
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="invoice"
              control={<Radio />}
              disabled
              label={
                <Box>
                  <Typography gutterBottom fontWeight="500">
                    {t('pages.book-course.pay-by-inv')}
                  </Typography>
                  <Typography variant="body2" color="grey.700">
                    {t('pages.book-course.pay-by-inv-info')}
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button variant="text" color="primary">
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!isValid}
        >
          {t('pages.book-course.step-2')}
        </Button>
      </Box>
    </Box>
  )
}
