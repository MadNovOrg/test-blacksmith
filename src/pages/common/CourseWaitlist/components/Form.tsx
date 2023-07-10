import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Grid,
  styled,
  TextField as MuiTextField,
  FormHelperText,
} from '@mui/material'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import PhoneNumberInput from '@app/components/PhoneNumberInput'
import { Recaptcha, RecaptchaActions } from '@app/components/Recaptcha'

import { getFormSchema } from './types'

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

export const Form: React.FC<React.PropsWithChildren<Props>> = ({
  onSuccess,
  saving,
}) => {
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
      recaptchaToken: '',
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

        <Recaptcha
          action={RecaptchaActions.JOIN_WAITLIST}
          onSuccess={token =>
            setValue('recaptchaToken', token, { shouldValidate: true })
          }
          onExpired={() =>
            setValue('recaptchaToken', '', { shouldValidate: true })
          }
        />

        {errors.recaptchaToken?.message ? (
          <FormHelperText error>{errors.recaptchaToken.message}</FormHelperText>
        ) : null}

        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
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
