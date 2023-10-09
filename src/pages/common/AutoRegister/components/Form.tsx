import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  styled,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { subYears, format } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useToggle, useUpdateEffect } from 'react-use'
import { useMutation } from 'urql'

import { CallbackOption, OrgSelector } from '@app/components/OrgSelector'
import { isHubOrg } from '@app/components/OrgSelector/utils'
import PhoneNumberInput from '@app/components/PhoneNumberInput'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  Organization,
} from '@app/generated/graphql'
import { useJobTitles } from '@app/hooks/useJobTitles'
import { MUTATION as CREATE_USER_MUTATION } from '@app/queries/invites/create-user'
import { INPUT_DATE_FORMAT } from '@app/util'

import { FormInputs, getFormSchema } from './types'

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

type Props = {
  onSuccess: () => void
  token: string
}

export const Form: React.FC<React.PropsWithChildren<Props>> = ({
  token,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [{ data: userData, error, fetching: loading }, createUser] =
    useMutation<CreateUserMutation, CreateUserMutationVariables>(
      CREATE_USER_MUTATION
    )

  const schema = useMemo(() => getFormSchema(t), [t])
  const url = import.meta.env.VITE_BASE_WORDPRESS_API_URL
  const { origin } = useMemo(() => (url ? new URL(url) : { origin: '' }), [url])

  const jobTitles = useJobTitles()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
    },
  })

  const values = watch()
  const minimalAge = subYears(new Date(), 16)

  const onSubmit = async (data: FormInputs) => {
    const input: CreateUserMutationVariables['input'] = {
      firstName: data.firstName,
      lastName: data.surname,
      password: data.password,
      phone: data.phone,
      dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
      orgId: data.organization?.id,
      acceptTnc: data.tcs,
      jobTitle: data.jobTitle === 'Other' ? data.otherJobTitle : data.jobTitle,
    }
    await createUser(
      { input },
      { fetchOptions: { headers: { 'x-auth': `Bearer ${token}` } } }
    )
  }

  const handleOrganizationSelection = useCallback(
    (org: CallbackOption) => {
      if (!org) {
        setValue('organization', undefined, {
          shouldValidate: true,
        })
        return
      }
      if (isHubOrg(org)) {
        setValue('organization', org as Pick<Organization, 'id' | 'name'>, {
          shouldValidate: true,
        })
        return
      }
    },
    [setValue]
  )
  useUpdateEffect(() => {
    if (userData?.createUser.email) onSuccess()
  }, [onSuccess, userData?.createUser.email])
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      aria-autocomplete="none"
      mt={3}
    >
      <Typography variant="body1" mb={1} fontWeight="600">
        {t('personal-details')}
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item md={6} xs={12}>
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
        <Grid item md={6} xs={12}>
          <TextField
            id="surname"
            label={t('surname')}
            variant="filled"
            placeholder={t('surname-placeholder')}
            error={!!errors.surname}
            helperText={errors.surname?.message}
            {...register('surname')}
            inputProps={{ 'data-testid': 'input-surname' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Grid flexDirection={'column'} container gap={3}>
        <Grid item>
          <TextField
            id="signup-pass"
            variant="filled"
            type={showPassword ? 'text' : 'password'}
            label={t('pages.signup.pass-label')}
            placeholder={t('pages.signup.pass-placeholder')}
            error={!!errors.password}
            helperText={errors.password?.message || ''}
            {...register('password')}
            fullWidth
            required
            inputProps={{ 'data-testid': 'input-pass' }}
            sx={{ bgcolor: 'grey.100' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <PhoneNumberInput
            label={t('phone')}
            variant="filled"
            sx={{ bgcolor: 'grey.100' }}
            inputProps={{ sx: { height: 40 }, 'data-testid': 'input-phone' }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            value={values.phone}
            onChange={p =>
              setValue('phone', p as string, { shouldValidate: true })
            }
            fullWidth
            required
          />
        </Grid>
        <Grid>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('dob')}
                  format={INPUT_DATE_FORMAT}
                  value={field.value}
                  onChange={(d: Date | null) => setValue('dob', d)}
                  maxDate={minimalAge}
                  slotProps={{
                    textField: {
                      variant: 'filled',
                      fullWidth: true,
                      sx: { bgcolor: 'grey.100' },
                      error: !!errors.dob,
                      helperText: errors.dob?.message,
                      required: true,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <OrgSelector
            {...register('organization')}
            showTrainerOrgOnly={false}
            error={errors.organization?.message}
            allowAdding
            value={values.organization ?? undefined}
            onChange={handleOrganizationSelection}
            textFieldProps={{
              variant: 'filled',
            }}
            isShallowRetrieval
            required
          />
        </Grid>
        <Grid item>
          <TextField
            select
            value={values.jobTitle ?? ''}
            {...register('jobTitle')}
            variant="filled"
            fullWidth
            label={t('job-title')}
          >
            <MenuItem value="" disabled>
              {t('job-title')}
            </MenuItem>
            {jobTitles.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {errors.jobTitle ? (
            <FormHelperText error>{errors.jobTitle?.message}</FormHelperText>
          ) : null}

          <Box sx={{ my: 1 }}>
            {values.jobTitle === 'Other' ? (
              <TextField
                id="other-job-title"
                variant="filled"
                label={t('other-job-title')}
                placeholder={t('other-job-title')}
                error={!!errors.otherJobTitle}
                helperText={errors.otherJobTitle?.message || ''}
                {...register('otherJobTitle')}
                fullWidth
                inputProps={{ 'data-testid': 'other-job-title-input' }}
              />
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ my: 5 }}>
        <Box sx={{ display: 'flex' }}>
          <FormControlLabel
            control={
              <Checkbox
                {...register('tcs')}
                inputProps={{ 'aria-label': `T&Cs` }}
              />
            }
            label={
              <>
                <Typography variant="body2">
                  <Trans i18nKey="pages.signup.tcs-label">
                    I accept the
                    <a
                      href={`${origin}/terms-of-business/`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t('terms-of-business')} (${t(
                        'opens-new-window'
                      )})`}
                    >
                      Terms of Business
                    </a>
                    and agree to Team Teach processing my personal data in
                    accordance with our
                    <a
                      href={`${origin}/privacy-policy`}
                      aria-label={`${t('privacy-policy')} (${t(
                        'opens-new-window'
                      )})`}
                    >
                      Privacy Policy
                    </a>
                  </Trans>
                </Typography>
                {errors.tcs ? (
                  <FormHelperText error>{errors.tcs.message}</FormHelperText>
                ) : null}
              </>
            }
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        <LoadingButton
          loading={loading}
          type="submit"
          variant="contained"
          color="primary"
          data-testid="signup-form-btn"
          size="large"
        >
          {t('pages.signup.submit-btn')}
        </LoadingButton>

        {error ? (
          <FormHelperText sx={{ mt: 2 }} error data-testid="signup-form-error">
            {error.message ?? t(`pages.signup.form-errors.UnknownError`)}
          </FormHelperText>
        ) : null}
      </Box>
    </Box>
  )
}
