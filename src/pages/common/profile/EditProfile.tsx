import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { styled } from '@mui/system'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { Avatar } from '@app/components/Avatar'
import { Dialog } from '@app/components/Dialog'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useProfileCertifications from '@app/hooks/useProfileCertifications'
import ImportCertificateModal from '@app/pages/common/profile/ImportCertificateModal'
import {
  MUTATION as UPDATE_PROFILE_MUTATION,
  ResponseType as UpdateProfileResponseType,
  ParamsType as UpdateProfileParamsType,
} from '@app/queries/profile/update-profile'
import theme from '@app/theme'
import { CourseCertificate } from '@app/types'

type ProfileInput = {
  firstName: string
  surname: string
  countryCode: string
  phone: string
  dob: Date | null
  jobTitle: string
  disabilities: string | null
  dietaryRestrictions: string | null
}

type EditProfilePageProps = unknown

const TextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minWidth: 300,

  '& .MuiInput-root': {
    height: 50,
  },
}))

enum DietaryRestrictionRadioValues {
  NO = 'NO',
  YES = 'YES',
}
enum DisabilitiesRadioValues {
  NO = 'NO',
  YES = 'YES',
  RATHER_NOT_SAY = 'RATHER_NOT_SAY',
}

export const EditProfilePage: React.FC<EditProfilePageProps> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const { profile, reloadCurrentProfile } = useAuth()
  const navigate = useNavigate()
  const { data, mutate } = useProfileCertifications(profile?.id)

  const [dietaryRestrictionsRadioValue, setDietaryRestrictionsRadioValue] =
    useState<DietaryRestrictionRadioValues | null>(null)
  const [disabilitiesRadioValue, setDisabilitiesRadioValue] =
    useState<DisabilitiesRadioValues | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  const ratherNotSayText = t<string>('rather-not-say')

  useEffect(() => {
    const restriction = profile?.dietaryRestrictions
    const disabilities = profile?.disabilities
    if (restriction !== null && !dietaryRestrictionsRadioValue) {
      setDietaryRestrictionsRadioValue(
        restriction
          ? DietaryRestrictionRadioValues.YES
          : DietaryRestrictionRadioValues.NO
      )
    }
    if (disabilities !== null && !disabilitiesRadioValue) {
      setDisabilitiesRadioValue(
        disabilities
          ? disabilities === ratherNotSayText
            ? DisabilitiesRadioValues.RATHER_NOT_SAY
            : DisabilitiesRadioValues.YES
          : DisabilitiesRadioValues.NO
      )
    }
  }, [
    dietaryRestrictionsRadioValue,
    disabilitiesRadioValue,
    profile,
    ratherNotSayText,
  ])

  const schema = useMemo(() => {
    const disabilitiesSchema =
      disabilitiesRadioValue === DisabilitiesRadioValues.YES
        ? yup
            .string()
            .required(
              t('validation-errors.required-field', { name: t('disabilities') })
            )
        : yup.string().nullable()
    const dietaryRestrictionsSchema =
      dietaryRestrictionsRadioValue === DietaryRestrictionRadioValues.YES
        ? yup.string().required(
            t('validation-errors.required-field', {
              name: t('dietary-restrictions'),
            })
          )
        : yup.string().nullable()
    return yup
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
        disabilities: disabilitiesSchema,
        dietaryRestrictions: dietaryRestrictionsSchema,
      })
      .required()
  }, [t, disabilitiesRadioValue, dietaryRestrictionsRadioValue])

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
      disabilities: profile?.disabilities || null,
      dietaryRestrictions: profile?.dietaryRestrictions || null,
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
            disabilities: data.disabilities,
            dietaryRestrictions: data.dietaryRestrictions,
          },
        }
      )

      setLoading(false)
      await reloadCurrentProfile()
      navigate('..')
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

              <Grid item md={12} pt={2}>
                <FormControl>
                  <Typography variant="body1" fontWeight={600}>
                    {t('dietary-restrictions-question')}
                  </Typography>
                  <RadioGroup
                    onChange={(event, newValue: string) => {
                      setDietaryRestrictionsRadioValue(
                        newValue as DietaryRestrictionRadioValues
                      )
                      setValue('dietaryRestrictions', '')
                    }}
                    row
                    value={dietaryRestrictionsRadioValue}
                  >
                    <FormControlLabel
                      value={DietaryRestrictionRadioValues.NO}
                      control={<Radio />}
                      label={t<string>('no')}
                    />
                    <FormControlLabel
                      value={DietaryRestrictionRadioValues.YES}
                      control={<Radio />}
                      label={t<string>('yes')}
                    />
                  </RadioGroup>
                  {dietaryRestrictionsRadioValue ===
                  DietaryRestrictionRadioValues.YES ? (
                    <Box>
                      <TextField
                        onChange={event =>
                          setValue('dietaryRestrictions', event.target.value)
                        }
                        label={t('dietary-restrictions-text-label')}
                        variant="standard"
                        fullWidth
                        required
                        error={!!errors.dietaryRestrictions}
                        helperText={errors.dietaryRestrictions?.message}
                        value={values.dietaryRestrictions}
                      />
                    </Box>
                  ) : null}
                </FormControl>
              </Grid>

              <Grid item md={12} pt={2}>
                <FormControl>
                  <Typography variant="body1" fontWeight={600}>
                    {t('disabilities-question')}
                  </Typography>
                  <RadioGroup
                    onChange={(event, newValue: string) => {
                      setValue(
                        'disabilities',
                        newValue === DisabilitiesRadioValues.RATHER_NOT_SAY
                          ? ratherNotSayText
                          : ''
                      )
                      setDisabilitiesRadioValue(
                        newValue as DisabilitiesRadioValues
                      )
                    }}
                    row
                    value={disabilitiesRadioValue}
                  >
                    <FormControlLabel
                      value={DisabilitiesRadioValues.NO}
                      control={<Radio />}
                      label={t<string>('no')}
                    />
                    <FormControlLabel
                      value={DisabilitiesRadioValues.YES}
                      control={<Radio />}
                      label={t<string>('yes')}
                    />
                    <FormControlLabel
                      value={DisabilitiesRadioValues.RATHER_NOT_SAY}
                      control={<Radio />}
                      label={ratherNotSayText}
                    />
                  </RadioGroup>
                  {disabilitiesRadioValue === DisabilitiesRadioValues.YES ? (
                    <Box>
                      <TextField
                        onChange={event =>
                          setValue('disabilities', event.target.value)
                        }
                        label={t('disabilities-text-label')}
                        variant="standard"
                        fullWidth
                        required
                        error={!!errors.disabilities}
                        helperText={errors.disabilities?.message}
                        value={values.disabilities}
                      />
                    </Box>
                  ) : null}
                </FormControl>
              </Grid>
            </Box>

            <Grid
              mt={3}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography variant="subtitle2">{t('certifications')}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowImportModal(true)}
              >
                {t('pages.my-profile.add-certificate')}
              </Button>
            </Grid>

            <Typography variant="body2" mt={1}>
              {t('certification-warning')}
            </Typography>

            {(data ?? []).map((certificate: CourseCertificate, index) => (
              <Box
                mt={2}
                bgcolor="common.white"
                p={3}
                borderRadius={1}
                key={certificate.id}
              >
                <Typography color={theme.palette.grey[700]} fontWeight={600}>
                  {certificate.courseName}
                </Typography>

                <Typography color={theme.palette.grey[700]} mt={1}>
                  {certificate.number}
                </Typography>

                {certificate.expiryDate ? (
                  isPast(new Date(certificate.expiryDate)) ? (
                    <Alert
                      severity={index === 0 ? 'error' : 'info'}
                      sx={{ mt: 1 }}
                    >
                      {`${t('course-certificate.expired-on')} ${format(
                        new Date(certificate.expiryDate),
                        'P'
                      )} (${formatDistanceToNow(
                        new Date(certificate.expiryDate)
                      )} ${t('ago')})`}
                    </Alert>
                  ) : (
                    <Alert variant="outlined" severity="success" sx={{ mt: 1 }}>
                      {`${t('course-certificate.active-until')} ${format(
                        new Date(certificate.expiryDate),
                        'P'
                      )} (${t(
                        'course-certificate.expires-in'
                      )} ${formatDistanceToNow(
                        new Date(certificate.expiryDate)
                      )}).`}
                    </Alert>
                  )
                ) : null}
              </Box>
            ))}

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

      <Dialog
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        title={t('common.course-certificate.update-certification-details')}
        maxWidth={600}
      >
        <ImportCertificateModal
          onCancel={() => setShowImportModal(false)}
          onSubmit={async () => {
            await mutate()
            setShowImportModal(false)
          }}
        />
      </Dialog>
    </Box>
  )
}
