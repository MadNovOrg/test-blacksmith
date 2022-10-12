import { yupResolver } from '@hookform/resolvers/yup'
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
  MenuItem,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { map } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  formSchema as invoiceDetailsFormSchema,
  InvoiceForm,
} from '@app/components/InvoiceForm'
import { OrgSelector } from '@app/components/OrgSelector'
import { PaymentMethod } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { CourseType, InvoiceDetails } from '@app/types'
import { getFieldError, requiredMsg } from '@app/util'

import { Sector, useBooking } from '../BookingContext'
import { PromoCode } from '../PromoCode'

type FormInputs = {
  quantity: number
  emails: string[]
  orgId: string
  sector: Sector
  position: string
  otherPosition: string
  paymentMethod: PaymentMethod

  invoiceDetails?: InvoiceDetails
}

export const CourseBookingDetails: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    course,
    availableSeats,
    booking,
    amounts,
    positions,
    sectors,
    addPromo,
    removePromo,
    setBooking,
  } = useBooking()

  const qtyOptions = useMemo(
    () => Array.from({ length: availableSeats }, (_, i) => i + 1),
    [availableSeats]
  )

  const onSubmit = async (data: FormInputs) => {
    setBooking(data)
    navigate('../review')
  }

  const schema = useMemo(() => {
    return yup.object({
      quantity: yup.number().required(),

      emails: yup
        .array()
        .of(
          yup
            .string()
            .email(t('validation-errors.email-invalid'))
            .required(t('validation-errors.email-invalid'))
        )
        .length(yup.ref('quantity'), t('validation-errors.max-registrants'))
        .required(requiredMsg(t, 'emails')),

      orgId: yup
        .string()
        .required(requiredMsg(t, 'org-name'))
        .typeError(requiredMsg(t, 'org-name')),

      sector: yup.string().required(),
      position: yup.string().required(),
      otherPosition: yup.string().when('position', {
        is: 'other',
        then: yup
          .string()
          .required(t('validation-errors.other-position-required')),
      }),

      paymentMethod: yup
        .string()
        .oneOf(Object.values(PaymentMethod))
        .required(),

      invoiceDetails: yup.object().when('paymentMethod', {
        is: PaymentMethod.Invoice,
        then: invoiceDetailsFormSchema(t),
      }),
    })
  }, [t])

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: booking.quantity,
      emails: booking.emails,
      orgId: booking.orgId,
      sector: booking.sector,
      position: booking.position,
      otherPosition: booking.otherPosition,
      paymentMethod: PaymentMethod.Invoice,
      invoiceDetails: booking.invoiceDetails,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    control,
    setValue,
  } = methods

  const values = watch()

  useEffect(() => {
    if (booking.quantity !== values.quantity) {
      setBooking({ quantity: values.quantity })
    }
  }, [booking, setBooking, values.quantity])

  const sectorOptions = useMemo(
    () =>
      map(sectors, (label, value) => ({
        label,
        value,
      })),
    [sectors]
  )

  const formatCurrency = (amount: number) => {
    return t('currency', { amount, currency: booking.currency })
  }

  const positionOptions = values.sector ? positions[values.sector] : []

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
      >
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
                  inputProps={{ id: 'qty-select' }}
                  disabled={booking.courseType === CourseType.CLOSED}
                  {...register('quantity')}
                >
                  {qtyOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
              <IconButton
                aria-label="delete"
                onClick={() => console.log('TBD')}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">{t('course-cost')}</Typography>
            <Typography color="grey.700">
              {formatCurrency(amounts.courseCost)}
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

          <Box mt={2} display="flex" justifyContent="space-between" mb={1}>
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

          {booking.courseType !== CourseType.CLOSED ? (
            <Box>
              <PromoCode
                codes={booking.promoCodes}
                discounts={booking.discounts}
                courseId={course.id}
                onAdd={addPromo}
                onRemove={removePromo}
              />
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

          <Box mt={2} display="flex" justifyContent="space-between">
            <Typography fontWeight="500" color="primary">
              {t('amount-due')} ({booking.currency})
            </Typography>
            <Typography fontWeight="500" color="primary">
              {formatCurrency(amounts.total)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('org-details')}
        </Typography>
        <Box bgcolor="common.white" p={2} mb={4}>
          <Box mb={3}>
            <OrgSelector
              allowAdding
              onChange={org => {
                setValue('orgId', org?.id ?? '', { shouldValidate: true })
              }}
              textFieldProps={{ variant: 'standard' }}
              sx={{ marginBottom: 2 }}
              error={errors.orgId?.message}
            />
          </Box>

          <Box mb={3}>
            <TextField
              select
              value={values.sector}
              {...register('sector')}
              variant="standard"
              fullWidth
              label={t('sector')}
              error={!!errors.sector}
            >
              <MenuItem value="" disabled>
                {t('sector')}
              </MenuItem>
              {sectorOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {errors.sector ? (
              <FormHelperText>{errors.sector?.message}</FormHelperText>
            ) : null}
          </Box>

          <Box mb={3}>
            <TextField
              select
              value={values.position}
              {...register('position')}
              variant="standard"
              fullWidth
              label={t('position')}
              error={!!errors.position}
            >
              <MenuItem value="" disabled>
                {positionOptions.length ? t('position') : t('select-sector')}
              </MenuItem>
              {positionOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              {positionOptions.length ? (
                <MenuItem value="other">{t('other')}</MenuItem>
              ) : null}
            </TextField>
            {errors.sector ? (
              <FormHelperText>{errors.sector?.message}</FormHelperText>
            ) : null}

            <Box mt={1}>
              {values.position === 'other' ? (
                <TextField
                  id="other-position"
                  variant="standard"
                  label={t('position-name')}
                  placeholder={t('position-placeholder')}
                  error={!!errors.otherPosition}
                  helperText={errors.otherPosition?.message || ''}
                  {...register('otherPosition')}
                  fullWidth
                  inputProps={{ 'data-testid': 'other-position-input' }}
                />
              ) : null}
            </Box>
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
            value={values?.emails}
            freeSolo
            autoSelect
            onChange={(_, v) =>
              setValue('emails', v, { shouldValidate: isSubmitted })
            }
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
                error={!!errors.emails}
                helperText={
                  errors.emails ? (
                    <Box
                      component="span"
                      display="flex"
                      justifyContent="space-between"
                      bgcolor="common.white"
                    >
                      <Typography variant="caption">
                        {values?.emails?.length} / {values.quantity}
                      </Typography>

                      <Typography variant="caption">
                        {getFieldError(errors.emails)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption">
                      {values?.emails?.length} / {values.quantity}
                    </Typography>
                  )
                }
              />
            )}
          />

          <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
            <b>{t('important')}:</b> {t('pages.book-course.notice')}
          </Alert>

          <Alert variant="filled" color="info" severity="info" sx={{ mt: 2 }}>
            <b>{t('important')}:</b> {t('pages.book-course.repeat-own-email')}
          </Alert>
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('pages.book-course.payment-details')}
        </Typography>
        <Box bgcolor="common.white" p={2} mb={4}>
          <FormControl
            sx={{
              '& .MuiRadio-root': { paddingY: 0 },
              '& .MuiFormControlLabel-root': {
                alignItems: 'flex-start',
                mb: 2,
              },
            }}
          >
            <FormLabel id="payment-method" sx={{ mb: 2, fontWeight: '600' }}>
              {t('pages.book-course.payment-method')}
            </FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="paymentMethod"
              render={({ field }) => {
                return (
                  <RadioGroup aria-labelledby="payment-method" {...field}>
                    <FormControlLabel
                      value={PaymentMethod.Cc}
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
                      value={PaymentMethod.Invoice}
                      control={<Radio />}
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
                )
              }}
            />
          </FormControl>

          {values.paymentMethod === PaymentMethod.Invoice ? (
            <Box bgcolor="grey.100" p={2}>
              <Typography variant="body1" fontWeight="600" mb={3}>
                {t('invoice-contact')}
              </Typography>

              <InvoiceForm />
            </Box>
          ) : null}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button variant="text" color="primary">
            {t('cancel')}
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {t('pages.book-course.step-2')}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
