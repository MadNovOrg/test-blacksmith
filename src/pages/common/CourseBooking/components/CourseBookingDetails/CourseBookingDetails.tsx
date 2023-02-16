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
  IconButton,
  InputLabel,
  MenuItem,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
  Checkbox,
  Typography,
} from '@mui/material'
import { map } from 'lodash-es'
import React, { useEffect, useMemo, useCallback } from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  Control,
  FieldErrors,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  formSchema as invoiceDetailsFormSchema,
  InvoiceForm,
} from '@app/components/InvoiceForm'
import { OrgSelector } from '@app/components/OrgSelector'
import { PaymentMethod } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { CourseType, InvoiceDetails, CourseLevel } from '@app/types'
import { getFieldError, requiredMsg } from '@app/util'

import { Sector, useBooking } from '../BookingContext'
import { PromoCode } from '../PromoCode'

export type AttendeeValidCertificateProps = {
  control: Control<FormInputs>
  errors: FieldErrors
  courseLevel: CourseLevel
  totalAttendees: number
}

const AttendeeValidCertificate: React.FC<
  React.PropsWithChildren<AttendeeValidCertificateProps>
> = ({ control, courseLevel, totalAttendees, errors }) => {
  const { t } = useTranslation()
  const showAttendeeTranslationOptions = useCallback(
    (courseLevel: CourseLevel, attendees: number) => {
      switch (courseLevel) {
        case CourseLevel.Advanced:
          return {
            attendees,
            certificates: 1,
            levels: t(
              'pages.book-course.attendee-with-valid-certificate.levels.advanced'
            ),
          }
        case CourseLevel.IntermediateTrainer:
          return {
            attendees,
            certificates: 2,
            levels: t(
              'pages.book-course.attendee-with-valid-certificate.levels.intermediate-trainer'
            ),
          }
        case CourseLevel.AdvancedTrainer:
          return {
            attendees,
            certificates: 3,
            levels: t(
              'pages.book-course.attendee-with-valid-certificate.levels.advanced-trainer'
            ),
          }
        default:
          return {}
      }
    },
    [t]
  )

  return (
    <Controller
      control={control}
      name="attendeeValidCertificate"
      render={({ field }) => (
        <Box bgcolor="common.white" pt={2}>
          <FormControlLabel
            {...field}
            control={<Checkbox />}
            label={
              <Typography color="grey.700">
                {t(
                  'pages.book-course.attendee-with-valid-certificate.message',
                  showAttendeeTranslationOptions(courseLevel, totalAttendees)
                )}
              </Typography>
            }
          />
          {errors.attendeeValidCertificate?.message && (
            <FormHelperText error>
              {errors.attendeeValidCertificate.message as string}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  )
}

const isAttendeeValidCertificateMandatory = (courseLevel: CourseLevel) =>
  [
    CourseLevel.Advanced,
    CourseLevel.IntermediateTrainer,
    CourseLevel.AdvancedTrainer,
  ].includes(courseLevel)

type FormInputs = {
  quantity: number
  emails: string[]
  orgId: string
  orgName: string
  sector: Sector
  position: string
  otherPosition: string
  paymentMethod: PaymentMethod

  invoiceDetails?: InvoiceDetails

  courseLevel: CourseLevel
  attendeeValidCertificate?: boolean
}

export const CourseBookingDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
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

      orgName: yup.string(),

      sector: yup.string().required(requiredMsg(t, 'sector')),
      position: yup.string().required(requiredMsg(t, 'position')),
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

      courseLevel: yup.string(),
      attendeeValidCertificate: yup.boolean().when('courseLevel', {
        is: isAttendeeValidCertificateMandatory,
        then: yup
          .boolean()
          .oneOf([true], t('validation-errors.this-field-is-required')),
        otherwise: yup.boolean(),
      }),
    })
  }, [t])

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: booking.quantity,
      emails: booking.emails,
      orgId: booking.orgId,
      orgName: booking.orgName,
      sector: booking.sector,
      position: booking.position,
      otherPosition: booking.otherPosition,
      paymentMethod: PaymentMethod.Invoice,
      invoiceDetails: booking.invoiceDetails,
      courseLevel: course.level,
      attendeeValidCertificate: false,
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

  const emailsOnChange = (_: unknown, values: string[]) => {
    let processed: string[] = []
    values.forEach(value => {
      processed = processed.concat(
        value
          .split(/[,\s;]/)
          .map(s => s.trim())
          .filter(Boolean)
      )
    })
    setValue('emails', processed, { shouldValidate: isSubmitted })
  }

  const showAttendeeValidCertificate = isAttendeeValidCertificateMandatory(
    course.level
  )

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
                  {...register('quantity', { valueAsNumber: true })}
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

          <Box mt={2} display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">{t('subtotal')}</Typography>
            <Typography color="grey.700">
              {formatCurrency(amounts.subtotalDiscounted)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="grey.700">
              {t('custom-vat', { amount: booking.vat })}
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
              value={
                values.orgId && values.orgName
                  ? { name: values.orgName, id: values.orgId }
                  : undefined
              }
              allowAdding
              onChange={org => {
                setValue('orgId', org?.id ?? '', { shouldValidate: true })
                setValue('orgName', org?.name ?? '')
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
              variant="filled"
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
              <FormHelperText error>{errors.sector?.message}</FormHelperText>
            ) : null}
          </Box>

          <Box mb={3}>
            <TextField
              select
              value={values.position}
              {...register('position')}
              variant="filled"
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
            {errors.position ? (
              <FormHelperText error>{errors.position?.message}</FormHelperText>
            ) : null}

            <Box mt={1}>
              {values.position === 'other' ? (
                <TextField
                  id="other-position"
                  variant="filled"
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
            onChange={emailsOnChange}
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
                variant="filled"
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
            <b>{t('important')}:</b> {`${t('pages.book-course.notice')}\n`}
            <b>{t('important')}:</b> {t('pages.book-course.repeat-own-email')}
          </Alert>

          {showAttendeeValidCertificate && (
            <AttendeeValidCertificate
              control={control}
              errors={errors}
              courseLevel={course.level}
              totalAttendees={values.quantity}
            />
          )}
        </Box>

        <Typography variant="subtitle1" fontWeight="500">
          {t('pages.book-course.payment-details')}
        </Typography>
        <Box bgcolor="common.white" p={2} pt={4} mb={4}>
          <FormControl
            sx={{
              '& .MuiRadio-root': { paddingY: 0 },
              '& .MuiFormControlLabel-root': {
                alignItems: 'flex-start',
                mb: 2,
              },
            }}
          >
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
            <Box p={2}>
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
