import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, FormHelperText, Grid, MenuItem, TextField } from '@mui/material'
import map from 'lodash-es/map'
import MuiPhoneNumber from 'material-ui-phone-number'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { schemas, yup } from '@app/schemas'

import { sectors } from '../../CourseBooking/components/org-data'

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
  interest: string
  phone: string
  orgName: string
  sector: string
  source?: string
  message?: string
}

type Props = {
  onSubmit?: (data: FormInputs) => void
  saving?: boolean
}

export const Form: React.FC<Props> = ({ onSubmit = noop, saving }) => {
  const { t } = useTranslation()

  const schema = useMemo(() => {
    return yup.object({
      firstName: yup.string().required(t('pages.enquiry.required-first-name')),
      lastName: yup.string().required(t('pages.enquiry.required-last-name')),
      email: schemas.email(t).required(t('pages.enquiry.required-email')),
      source: yup.string(),
      interest: yup.string().required(t('pages.enquiry.required-interest')),
      message: yup.string(),
      orgName: yup.string().required(t('pages.enquiry.required-organization')),
      sector: yup.string().required(t('pages.enquiry.required-sector')),
      phone: yup.string().required(t('pages.enquiry.required-phone')),
    })
  }, [t])

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
      <TextField
        id="interest"
        label={t('pages.enquiry.interest-label')}
        variant="standard"
        error={!!errors.interest}
        helperText={errors.interest?.message}
        {...register('interest')}
        inputProps={{ 'data-testid': 'input-interest' }}
        sx={{ bgcolor: 'grey.100', marginBottom: 3 }}
        fullWidth
        required
      />
      <Grid container spacing={3} mb={3}>
        <Grid item md={6}>
          <TextField
            id="firstName"
            label={t('first-name')}
            variant="standard"
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
            variant="standard"
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
        label={t('pages.enquiry.email-label')}
        variant="standard"
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
          variant="standard"
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
        variant="standard"
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
          variant="standard"
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
      <TextField
        id="source"
        select
        label={t('pages.enquiry.source-label')}
        variant="standard"
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
          {t('pages.enquiry.source-label')}
        </MenuItem>
        {sourceOptions.map(option => (
          <MenuItem key={option} value={option} data-testid={`${option}`}>
            {t(`pages.enquiry.${option}`)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="message"
        label={t('pages.enquiry.message-label')}
        variant="standard"
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
          {t('pages.enquiry.submit-button-label')}
        </LoadingButton>
      </Box>
    </form>
  )
}
