import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  TextField as MuiTextField,
  FormHelperText,
  Grid,
  styled,
} from '@mui/material'
import MuiPhoneNumber from 'material-ui-phone-number'
import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION,
  ResponseType,
  ParamsType,
} from '@app/queries/booking/insert-waitlist'

import { FormInputs, getFormSchema } from './types'

const onlyCountries = ['au', 'gb']

const TextField = styled(MuiTextField)(() => ({
  '& .MuiInput-root': {
    height: 40,
  },
}))

type Props = {
  onSuccess: (email: string) => void
  courseId: number
}

export const Form: React.FC<Props> = ({ onSuccess, courseId }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    },
  })

  const values = watch()

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setError('')

    try {
      const input = {
        email: data.email,
        givenName: data.firstName,
        familyName: data.surname,
        phone: data.phone,
        orgName: data.orgName,
        courseId,
      }

      await gqlRequest<ResponseType, ParamsType>(MUTATION, { input })

      setLoading(false)

      onSuccess(data.email)
    } catch (err) {
      console.log(err)
      const { code = 'UnknownError' } = err as Error & { code: string }
      setError(
        t(`pages.waitlist.form-errors.${code}`) || t(`form-errors.UnknownError`)
      )
      setLoading(false)
    }
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
              id="surname"
              label={t('surname')}
              variant="standard"
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
            label={t('email')}
            variant="standard"
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

        <Box mb={3}>
          <TextField
            id="orgName"
            label={t('org-name')}
            variant="standard"
            placeholder={t('orgName-placeholder')}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('orgName')}
            inputProps={{ 'data-testid': 'input-orgName' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="btn-submit"
            size="large"
          >
            {t('join-waitlist')}
          </LoadingButton>

          {error ? (
            <FormHelperText sx={{ mt: 2 }} error data-testid="form-error">
              {error}
            </FormHelperText>
          ) : null}
        </Box>
      </Box>
    </>
  )
}
