import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { Avatar } from '@app/components/Avatar'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as UPDATE_PROFILE_MUTATION,
  ResponseType as UpdateProfileResponseType,
  ParamsType as UpdateProfileParamsType,
} from '@app/queries/profile/update-profile'

type ProfileInput = {
  firstName: string
  surname: string
  countryCode: string
  phone: string
  dob: Date | null
  jobTitle: string
}

type EditProfilePageProps = unknown

const TextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minWidth: 300,

  '& .MuiInput-root': {
    height: 50,
  },
}))

export const EditProfilePage: React.FC<EditProfilePageProps> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()

  const schema = useMemo(
    () =>
      yup
        .object({
          firstName: yup
            .string()
            .required(
              t('validation-errors.required-field', { name: t('first-name') })
            ),
          surname: yup
            .string()
            .required(
              t('validation-errors.required-field', { name: t('surname') })
            ),
          countryCode: yup.string(),
          phone: yup.string(),
          dob: yup.date().nullable(),
          org: yup.string(),
        })
        .required(),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: profile?.givenName || '',
      surname: profile?.familyName || '',
      countryCode: '+44',
      phone: profile?.phone || '',
      dob: profile?.dob ? new Date(profile.dob) : null,
      jobTitle: profile?.jobTitle || '',
    },
  })
  const values = watch()

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true)

    try {
      await fetcher<UpdateProfileResponseType, UpdateProfileParamsType>(
        UPDATE_PROFILE_MUTATION,
        {
          // have to supply a required field `where` hence passing profileId, we still
          // have perm check on the backend that does not allow updaing someone else's profile
          profileId: profile?.id || '',
          input: {
            givenName: data.firstName,
            familyName: data.surname,
            phone: data.phone,
            dob: data.dob,
            jobTitle: data.jobTitle,
          },
        }
      )

      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  if (!profile) return null

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <Container>
        <Grid container>
          <Grid
            item
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={profile.avatar}
              name={profile.fullName}
              size={220}
              sx={{ mb: 4 }}
            />
            <Typography variant="h1" whiteSpace="nowrap">
              {profile.fullName}
            </Typography>
            <Typography variant="body1" color="grey.700">
              {profile.email}
            </Typography>

            <Box mt={5}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => console.log('TBD')}
                sx={{ mr: 1 }}
              >
                {t('remove')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log('TBD')}
              >
                {t('change')}
              </Button>
            </Box>
          </Grid>

          <Grid
            item
            md={8}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="EditProfileForm"
            noValidate
            autoComplete="off"
          >
            <Typography variant="subtitle2" mb={1}>
              {t('personal-details')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
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
                    inputProps={{ 'data-testid': 'first-name' }}
                    autoFocus
                    fullWidth
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
                    inputProps={{ 'data-testid': 'surname' }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box mb={3}>
                <TextField
                  id="email"
                  label={t('email')}
                  variant="standard"
                  value={profile.email}
                  inputProps={{ 'data-testid': 'email' }}
                  disabled
                  fullWidth
                />
              </Box>

              <Grid container spacing={3} mb={3}>
                {/** TODO: bring back later */}
                {/* <Grid item md={3}>
                  <TextField
                    id="country-code"
                    label={t('country-code')}
                    variant="standard"
                    placeholder={t('country-code-placeholder')}
                    {...register('countryCode')}
                    inputProps={{ 'data-testid': 'country-code' }}
                    sx={{ minWidth: 100 }}
                    fullWidth
                  />
                </Grid> */}
                <Grid item md={9}>
                  <TextField
                    id="phone"
                    label={t('phone')}
                    variant="standard"
                    placeholder={t('phone-placeholder')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    {...register('phone')}
                    inputProps={{ 'data-testid': 'phone' }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      value={values.dob}
                      onChange={(d: Date | null) => setValue('dob', d)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={t('dob')}
                          variant="standard"
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="job-title"
                    label={t('job-title')}
                    variant="standard"
                    placeholder={t('job-title-placeholder')}
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle?.message}
                    {...register('jobTitle')}
                    fullWidth
                    inputProps={{ 'data-testid': 'job-title' }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                color="primary"
                component={LinkBehavior}
                href=".."
              >
                {t('cancel')}
              </Button>

              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
                type="submit"
                loading={loading}
              >
                {t('save-changes')}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
