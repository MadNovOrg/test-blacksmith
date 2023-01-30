import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Grid, styled, TextField as MuiTextField } from '@mui/material'
import MuiPhoneNumber from 'material-ui-phone-number'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { getFormSchema } from './types'

const onlyCountries = ['au', 'gb']

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

export type FormInputs = InferType<ReturnType<typeof getFormSchema>>

type Props = {
  onSuccess: (data: FormInputs) => void
  saving: boolean
}

export const Form: React.FC<Props> = ({ onSuccess, saving }) => {
  const { t } = useTranslation()

  const schema = useMemo(() => getFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      phone: '',
      orgName: '',
    },
  })

  const values = watch()

  const onSubmit: SubmitHandler<FormInputs> = data => {
    onSuccess(data)
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        mt={3}
      >
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
              id="surname"
              label={t('last-name')}
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

        <Box mb={3}>
          <TextField
            id="email"
            label={t('work-email')}
            variant="filled"
            placeholder={t('email-placeholder')}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            inputProps={{ 'data-testid': 'input-email' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Box>

        <Box mb={5}>
          <MuiPhoneNumber
            label={t('phone')}
            onlyCountries={onlyCountries}
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

        <Box mb={3}>
          <TextField
            id="orgName"
            label={t('org-name')}
            variant="filled"
            placeholder={t('orgName-placeholder')}
            error={!!errors.orgName}
            helperText={errors.orgName?.message}
            {...register('orgName')}
            inputProps={{ 'data-testid': 'input-orgName' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            data-testid="btn-submit"
            size="large"
            loading={saving}
          >
            {t('join-waitlist')}
          </LoadingButton>
        </Box>
      </Box>
    </>
  )
}
