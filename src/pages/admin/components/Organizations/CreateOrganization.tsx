import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FormPanel } from '@app/components/FormPanel'
import { Sticky } from '@app/components/Sticky'
import {
  InsertOrgMutation,
  InsertOrgMutationVariables,
  Trust_Type_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgNameXeroAutocomplete } from '@app/pages/admin/components/Organizations/OrgNameXeroAutocomplete'
import { sectors } from '@app/pages/common/CourseBooking/components/org-data'
import { MUTATION } from '@app/queries/organization/insert-org'
import { yup } from '@app/schemas'
import { Address, OfstedRating, TrustType } from '@app/types'
import { INPUT_DATE_FORMAT, requiredMsg } from '@app/util'

type FormInputs = {
  orgName: string
  trustType: string
  trustName: string
  orgEmail: string
  orgPhone: string
  sector: string
  localAuthority: string
  ofstedRating: string
  ofstedLastInspection: Date | null
  headFirstName: string
  headLastName: string
  headTitle: string
  headPreferredJobTitle: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  postCode: string
  workEmail: string
}

export const CreateOrganization = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [xeroId, setXeroId] = useState<string>()

  const schema = useMemo(() => {
    return yup.object({
      orgName: yup
        .string()
        .required(
          requiredMsg(t, 'pages.create-organization.fields.organization-name')
        ),
      trustType: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('trust-type') })
        ),
      trustName: yup.string(),
      workEmail: yup.string().email(t('validation-errors.email-invalid')),
      orgEmail: yup.string(),
      orgPhone: yup.string(),
      sector: yup.string(),
      localAuthority: yup.string(),
      ofstedRating: yup.string(),
      ofstedLastInspection: yup.date().nullable(),
      addressLine1: yup.string().required(requiredMsg(t, 'addr.line1')),
      addressLine2: yup.string(),
      city: yup.string().required(requiredMsg(t, 'addr.city')),
      country: yup.string().required(requiredMsg(t, 'addr.country')),
      postCode: yup.string().required(requiredMsg(t, 'addr.postCode')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      orgName: '',
      trustName: '',
      trustType: Trust_Type_Enum.NotApplicable,
      orgEmail: '',
      orgPhone: '',
      sector: '',
      localAuthority: '',
      ofstedRating: '',
      ofstedLastInspection: null,
      headFirstName: '',
      headLastName: '',
      headTitle: '',
      headPreferredJobTitle: '',
      website: '',
      workEmail: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      postCode: '',
    },
  })

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetcher<
        InsertOrgMutation,
        InsertOrgMutationVariables
      >(MUTATION, {
        name: data.orgName,
        trustName: data.trustName,
        trustType: data.trustType as Trust_Type_Enum,
        sector: data.sector,
        attributes: {
          email: data.orgEmail,
          phone: data.orgPhone,
          localAuthority: data.localAuthority,
          ofstedRating: data.ofstedRating,
          ofstedLastInspection: data.ofstedLastInspection
            ? data.ofstedLastInspection.toISOString()
            : null,
          headFirstName: data.headFirstName,
          headLastName: data.headLastName,
          headTitle: data.headTitle,
          headPreferredJobTitle: data.headPreferredJobTitle,
          website: data.website,
        },
        address: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.city,
          country: data.country,
          postCode: data.postCode,
        } as Address,
        xeroId,
        invites: [
          {
            email: data.workEmail,
            isAdmin: true,
          },
        ],
      })
      if (response.org) {
        navigate(`../${response.org.id}`)
      }
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const values = watch()

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box
          display="flex"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          aria-autocomplete="none"
        >
          <Box width={400} display="flex" flexDirection="column" px={6}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton />
              </Box>
              <Box>
                <Typography variant="h2" mb={2}>
                  {t('pages.create-organization.add-new-organization')}
                </Typography>
              </Box>
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box display="flex" flexDirection="column" gap={2} mt={8}>
              <Typography variant="subtitle1">
                {t('pages.create-organization.organization-details')}
              </Typography>

              <FormPanel>
                <Box mb={3}>
                  <Controller
                    name="orgName"
                    control={control}
                    render={({ field }) => (
                      <OrgNameXeroAutocomplete
                        value={field.value}
                        onChange={value => {
                          const isXeroContact = typeof value === 'object'
                          setXeroId(isXeroContact ? value.contactID : undefined)
                          field.onChange(isXeroContact ? value.name : value)
                        }}
                        error={errors.orgName?.message}
                      />
                    )}
                  />
                </Box>

                <Box mb={3}>
                  <Controller
                    name="trustType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        id="trustType"
                        select
                        required
                        label={t('pages.edit-org-details.trust-type')}
                        variant="filled"
                        error={!!errors.trustType}
                        helperText={errors.trustType?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputProps={{ 'data-testid': 'trust-type' }}
                        fullWidth
                      >
                        {Object.values(TrustType).map(option => (
                          <MenuItem
                            key={option}
                            value={option}
                            data-testid={`trust-type-option-${option}`}
                          >
                            {t(`trust-type.${option.toLowerCase()}`)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    id="trustName"
                    label={t('pages.edit-org-details.trust-name')}
                    variant="filled"
                    error={!!errors.trustName}
                    helperText={errors.trustName?.message}
                    {...register('trustName')}
                    inputProps={{ 'data-testid': 'trust-name' }}
                    fullWidth
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    id="orgEmail"
                    label={t('pages.edit-org-details.org-email')}
                    variant="filled"
                    error={!!errors.orgEmail}
                    helperText={errors.orgEmail?.message}
                    {...register('orgEmail')}
                    inputProps={{ 'data-testid': 'org-email' }}
                    fullWidth
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    id="orgPhone"
                    label={t('pages.edit-org-details.org-phone')}
                    variant="filled"
                    error={!!errors.orgPhone}
                    helperText={errors.orgPhone?.message}
                    {...register('orgPhone')}
                    inputProps={{ 'data-testid': 'org-phone' }}
                    fullWidth
                  />
                </Box>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={6}>
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
                      {Object.entries(sectors).map(([value, label]) => (
                        <MenuItem
                          key={value}
                          value={value}
                          data-testid={`sector-${value}`}
                        >
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      id="localAuthority"
                      label={t('pages.edit-org-details.local-authority')}
                      variant="filled"
                      error={!!errors.localAuthority}
                      helperText={errors.localAuthority?.message}
                      {...register('localAuthority')}
                      inputProps={{ 'data-testid': 'local-authority' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={6}>
                    <Controller
                      name="ofstedRating"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          id="ofstedRating"
                          select
                          label={t('pages.edit-org-details.ofsted-rating')}
                          variant="filled"
                          error={!!errors.ofstedRating}
                          helperText={errors.ofstedRating?.message}
                          value={field.value}
                          onChange={field.onChange}
                          data-testid="ofsted-rating-select"
                          fullWidth
                        >
                          {Object.keys(OfstedRating).map(option => (
                            <MenuItem
                              key={option}
                              value={option}
                              data-testid={`ofsted-rating-option-${option}`}
                            >
                              {t(`ofsted-rating.${option.toLowerCase()}`)}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <Controller
                      name="ofstedLastInspection"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            format={INPUT_DATE_FORMAT}
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                error: !!errors.ofstedRating,
                                helperText: errors.ofstedRating?.message,
                                label: t(
                                  'pages.edit-org-details.ofsted-last-inspection'
                                ),
                                variant: 'filled',
                                fullWidth: true,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormPanel>

              <Typography variant="subtitle1">
                {t('common.org-address')}
              </Typography>

              <FormPanel>
                <Box mb={3}>
                  <TextField
                    id="line1"
                    label={t('common.addr.line1')}
                    variant="filled"
                    placeholder={t('common.addr.line1-placeholder')}
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                    {...register('addressLine1')}
                    inputProps={{ 'data-testid': 'addr-line1' }}
                    fullWidth
                    required
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    id="line2"
                    label={t('addr.line2')}
                    variant="filled"
                    placeholder={t('addr.line2-placeholder')}
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                    {...register('addressLine2')}
                    inputProps={{ 'data-testid': 'addr-line2' }}
                    fullWidth
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    id="city"
                    label={t('addr.city')}
                    variant="filled"
                    placeholder={t('addr.city')}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    {...register('city')}
                    inputProps={{ 'data-testid': 'city' }}
                    fullWidth
                    required
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    id="country"
                    label={t('addr.country')}
                    variant="filled"
                    placeholder={t('addr.country')}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    {...register('country')}
                    inputProps={{ 'data-testid': 'country' }}
                    fullWidth
                    required
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    id="postCode"
                    label={t('addr.postCode')}
                    variant="filled"
                    placeholder={t('addr.postCode')}
                    error={!!errors.postCode}
                    helperText={errors.postCode?.message}
                    {...register('postCode')}
                    inputProps={{ 'data-testid': 'postCode' }}
                    fullWidth
                    required
                  />
                </Box>
              </FormPanel>

              <Typography variant="subtitle1">
                {t('pages.edit-org-details.additional-details')}
              </Typography>

              <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item md={6}>
                    <TextField
                      id="headFirstName"
                      label={t('pages.edit-org-details.head-first-name')}
                      variant="filled"
                      error={!!errors.headFirstName}
                      helperText={errors.headFirstName?.message}
                      {...register('headFirstName')}
                      inputProps={{ 'data-testid': 'head-first-name' }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      id="headLastName"
                      label={t('pages.edit-org-details.head-last-name')}
                      variant="filled"
                      error={!!errors.headLastName}
                      helperText={errors.headLastName?.message}
                      {...register('headLastName')}
                      inputProps={{ 'data-testid': 'head-last-name' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box mb={3}>
                  <TextField
                    id="headTitle"
                    label={t('pages.edit-org-details.head-title')}
                    variant="filled"
                    error={!!errors.headTitle}
                    helperText={errors.headTitle?.message}
                    {...register('headTitle')}
                    inputProps={{ 'data-testid': 'head-title' }}
                    fullWidth
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    id="headPreferredJobTitle"
                    label={t('pages.edit-org-details.head-preferred-job-title')}
                    variant="filled"
                    error={!!errors.headPreferredJobTitle}
                    helperText={errors.headPreferredJobTitle?.message}
                    {...register('headPreferredJobTitle')}
                    inputProps={{ 'data-testid': 'head-preferred-job-title' }}
                    fullWidth
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    id="website"
                    label={t('pages.edit-org-details.website')}
                    variant="filled"
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    {...register('website')}
                    inputProps={{ 'data-testid': 'website' }}
                    fullWidth
                  />
                </Box>
              </Box>

              <Typography variant="subtitle1">
                {t('pages.create-organization.organization-admin-details')}
              </Typography>

              <Typography variant="body1" color={theme.palette.grey[700]}>
                {t(
                  'pages.create-organization.organization-admin-details-subtitle'
                )}
              </Typography>

              <FormPanel>
                <TextField
                  id="workEmail"
                  label={t('pages.create-organization.fields.work-email')}
                  variant="filled"
                  error={!!errors.workEmail}
                  helperText={errors.workEmail?.message}
                  {...register('workEmail')}
                  inputProps={{ 'data-testid': 'input-admin-email' }}
                  sx={{ bgcolor: 'grey.100' }}
                  fullWidth
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Box display="inline" fontWeight="600">
                    {`${t('common.important')}: `}
                  </Box>
                  {t('pages.create-organization.email-alert')}
                </Alert>
              </FormPanel>

              <Grid
                container
                width="100%"
                display="flex"
                justifyContent="flex-end"
                gap={2}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate(-1)}
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="create-org-form-submit-btn"
                  size="large"
                >
                  {t('pages.create-organization.save-organization')}
                </LoadingButton>

                {error ? (
                  <FormHelperText
                    sx={{ mt: 2 }}
                    error
                    data-testid="create-org-form-error"
                  >
                    {error}
                  </FormHelperText>
                ) : null}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
