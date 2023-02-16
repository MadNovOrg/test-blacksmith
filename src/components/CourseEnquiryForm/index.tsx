import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, FormHelperText, Grid, MenuItem, TextField } from '@mui/material'
import map from 'lodash-es/map'
import MuiPhoneNumber from 'material-ui-phone-number'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { CourseType } from '@app/generated/graphql'
import { schemas, yup } from '@app/schemas'

import { sectors } from '../../pages/common/CourseBooking/components/org-data'

const sourceOptions = [
  'source-word-of-mouth',
  'source-facebook',
  'source-twitter',
  'source-linkedin',
  'source-instagram',
  'source-reddit',
  'source-email',
  'source-google',
  'source-bing',
  'source-other-search',
  'source-telemarketing',
  'source-leaflet',
]

export type FormInputs = {
  firstName: string
  lastName: string
  email: string
  interest?: string
  phone: string
  orgName: string
  sector: string
  source?: string
  message?: string
  numParticipants?: number
}

type Props = {
  onSubmit?: (data: FormInputs) => void
  saving?: boolean
  courseType?: CourseType.Closed | CourseType.Open
}

export const CourseEnquiryForm: React.FC<React.PropsWithChildren<Props>> = ({
  onSubmit = noop,
  saving,
  courseType = CourseType.Open,
}) => {
  const { t } = useTranslation()

  const schema = useMemo(() => {
    return yup.object({
      firstName: yup
        .string()
        .required(t('components.course-enquiry-form.required-first-name')),
      lastName: yup
        .string()
        .required(t('components.course-enquiry-form.required-last-name')),
      email: schemas
        .email(t)
        .required(t('components.course-enquiry-form.required-email')),
      source: yup.string(),
      ...(courseType === CourseType.Open
        ? {
            interest: yup
              .string()
              .required(t('components.course-enquiry-form.required-interest')),
          }
        : {
            numParticipants: yup
              .number()
              .positive(
                t('components.course-enquiry-form.participants-negative')
              ),
          }),
      message: yup.string(),
      orgName: yup
        .string()
        .required(t('components.course-enquiry-form.required-organization')),
      sector: yup
        .string()
        .required(t('components.course-enquiry-form.required-sector')),
      phone: yup
        .string()
        .required(t('components.course-enquiry-form.required-phone')),
    })
  }, [t, courseType])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      interest: '',
      firstName: '',
      lastName: '',
      email: '',
      orgName: '',
      phone: '',
      sector: '',
      source: '',
      message: '',
    },
  })

  const values = watch()

  const sectorOptions = useMemo(
    () =>
      map(sectors, (label, value) => ({
        label,
        value,
      })),
    []
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {courseType === CourseType.Open ? (
        <TextField
          id="interest"
          label={t('components.course-enquiry-form.interest-label')}
          variant="filled"
          error={!!errors.interest}
          helperText={errors.interest?.message}
          {...register('interest')}
          inputProps={{ 'data-testid': 'input-interest' }}
          sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
          fullWidth
          required
        />
      ) : null}

      <Grid container spacing={3} mb={3}>
        <Grid item md={6}>
          <TextField
            id="firstName"
            label={t('first-name')}
            variant="filled"
            placeholder={t('first-name-placeholder')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
            inputProps={{ 'data-testid': 'input-first-name' }}
            sx={{ bgcolor: 'grey.100' }}
            autoFocus
            fullWidth
            required
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            id="lastname"
            label={t('last-name')}
            variant="filled"
            placeholder={t('last-name-placeholder')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
            inputProps={{ 'data-testid': 'input-lastname' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <TextField
        id="email"
        label={t('components.course-enquiry-form.email-label')}
        variant="filled"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
        inputProps={{ 'data-testid': 'input-email' }}
        sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
        fullWidth
        required
      />

      <Box mb={3}>
        <MuiPhoneNumber
          label={t('phone')}
          onlyCountries={['au', 'gb']}
          defaultCountry="gb"
          variant="filled"
          sx={{ bgcolor: 'grey.100' }}
          inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
          countryCodeEditable={false}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          value={values.phone}
          onChange={p =>
            setValue('phone', p as string, { shouldValidate: true })
          }
          fullWidth
          required
        />
      </Box>

      <TextField
        id="orgName"
        label={t('org-name')}
        variant="filled"
        error={!!errors.orgName}
        helperText={errors.orgName?.message}
        {...register('orgName')}
        inputProps={{ 'data-testid': 'input-orgName' }}
        sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
        fullWidth
        required
      />
      <Box mb={3}>
        <TextField
          select
          value={values.sector}
          {...register('sector')}
          variant="filled"
          fullWidth
          label={t('sector')}
          error={!!errors.sector}
          sx={{ bgcolor: 'grey.100' }}
          data-testid="sector-select"
        >
          <MenuItem value="" disabled>
            {t('sector')}
          </MenuItem>
          {sectorOptions.map(option => (
            <MenuItem
              key={option.value}
              value={option.value}
              data-testid={`sector-${option.value}`}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {errors.sector ? (
          <FormHelperText error>{errors.sector?.message}</FormHelperText>
        ) : null}
      </Box>
      {courseType === CourseType.Closed ? (
        <TextField
          id="numParticipants"
          label={t('components.course-enquiry-form.participants-label')}
          variant="filled"
          type="number"
          min="0"
          error={!!errors.numParticipants}
          helperText={errors.numParticipants?.message}
          {...register('numParticipants')}
          inputProps={{ 'data-testid': 'input-num-participants' }}
          sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
          fullWidth
        />
      ) : null}
      <TextField
        id="source"
        select
        label={t('components.course-enquiry-form.source-label')}
        variant="filled"
        error={!!errors.source}
        helperText={errors.source?.message}
        value={values.source}
        {...register('source')}
        inputProps={{ 'data-testid': 'input-source' }}
        sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
        fullWidth
        data-testid="source-select"
      >
        <MenuItem value="" disabled>
          {t('components.course-enquiry-form.source-label')}
        </MenuItem>
        {sourceOptions.map(option => (
          <MenuItem key={option} value={option} data-testid={`${option}`}>
            {t(`components.course-enquiry-form.${option}`)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="message"
        label={t('components.course-enquiry-form.message-label')}
        variant="filled"
        error={!!errors.message}
        helperText={errors.message?.message}
        {...register('message')}
        inputProps={{ 'data-testid': 'input-message' }}
        sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
        fullWidth
      />

      <Box display="flex" flexDirection="column" alignItems="center">
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          data-testid="btn-submit"
          size="large"
          loading={saving}
        >
          {t('components.course-enquiry-form.submit-button-label')}
        </LoadingButton>
      </Box>
    </form>
  )
}
