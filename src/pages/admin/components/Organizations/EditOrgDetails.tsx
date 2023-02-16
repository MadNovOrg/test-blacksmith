import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import {
  Trust_Type_Enum,
  UpdateOrgMutation,
  UpdateOrgMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useOrg from '@app/hooks/useOrg'
import { MUTATION as UPDATE_ORG_MUTATION } from '@app/queries/organization/update-org'
import { OfstedRating, TrustType } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

type OrgDetailsInput = {
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
  line1: string
  line2: string
  city: string
  country: string
  postCode: string
}

const TextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}))

export const EditOrgDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const { data, mutate } = useOrg(
    id ?? '',
    profile?.id,
    acl.canViewAllOrganizations()
  )
  const org = data?.length ? data[0] : null

  const schema = useMemo(() => {
    return yup
      .object({
        orgName: yup
          .string()
          .required(
            t('validation-errors.required-field', { name: t('org-name') })
          ),
        trustType: yup.string(),
        trustName: yup.string(),
        orgEmail: yup.string(),
        orgPhone: yup.string(),
        sector: yup.string(),
        localAuthority: yup.string(),
        ofstedRating: yup.string(),
        ofstedLastInspection: yup.date().nullable(),
        line1: yup.string(),
        line2: yup.string(),
        city: yup.string(),
        country: yup.string(),
        postCode: yup.string(),
      })
      .required()
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<OrgDetailsInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      orgName: '',
      trustType: '',
      trustName: '',
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
      line1: '',
      line2: '',
      city: '',
      country: '',
      postCode: '',
    },
  })

  useEffect(() => {
    if (org) {
      setValue('orgName', org.name)
      setValue('trustType', org.trustType || TrustType.NotApplicable)
      setValue('trustName', org.trustName || '')
      setValue('orgEmail', org.attributes.email)
      setValue('orgPhone', org.attributes.phone)
      setValue('sector', org.sector || '')
      setValue('localAuthority', org.attributes.localAuthority)
      setValue('ofstedRating', org.attributes.ofstedRating || '')
      setValue(
        'ofstedLastInspection',
        org.attributes.ofstedLastInspection
          ? new Date(org?.attributes.ofstedLastInspection)
          : null
      )
      setValue('headFirstName', org.attributes.headFirstName)
      setValue('headLastName', org.attributes.headLastName)
      setValue('headTitle', org.attributes.headTitle)
      setValue('headPreferredJobTitle', org.attributes.headPreferredJobTitle)
      setValue('website', org.attributes.website)
      setValue('line1', org.address.line1 || '')
      setValue('line2', org.address.line2 || '')
      setValue('city', org.address.city || '')
      setValue('country', org.address.country || '')
      setValue('postCode', org.address.postCode || '')
    }
  }, [org, setValue])

  const onSubmit = async (data: OrgDetailsInput) => {
    if (!id) return

    setLoading(true)

    try {
      await fetcher<UpdateOrgMutation, UpdateOrgMutationVariables>(
        UPDATE_ORG_MUTATION,
        {
          id,
          org: {
            name: data.orgName,
            trustType: data.trustType as Trust_Type_Enum,
            trustName: data.trustName,
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
              line1: data.line1,
              line2: data.line2,
              city: data.city,
              country: data.country,
              postCode: data.postCode,
            },
          },
        }
      )

      setLoading(false)
      await mutate()
      navigate('..?tab=DETAILS')
    } catch (err) {
      setLoading(false)
    }
  }

  if (!org) return null

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
            <Typography variant="h2">
              {t('pages.edit-org-details.title')}
            </Typography>
          </Grid>

          <Grid
            item
            md={8}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="EditOrgForm"
            noValidate
            autoComplete="off"
          >
            <Typography variant="subtitle2" mb={1}>
              {t('pages.edit-org-details.organization-details')}
            </Typography>

            <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
              <Box mb={3}>
                <TextField
                  id="orgName"
                  required
                  label={t('pages.edit-org-details.org-name')}
                  variant="filled"
                  error={!!errors.orgName}
                  helperText={errors.orgName?.message}
                  {...register('orgName')}
                  inputProps={{ 'data-testid': 'org-name' }}
                  fullWidth
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
                    id="sector"
                    label={t('pages.edit-org-details.sector')}
                    variant="filled"
                    error={!!errors.sector}
                    helperText={errors.sector?.message}
                    {...register('sector')}
                    inputProps={{ 'data-testid': 'sector' }}
                    fullWidth
                  />
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
                          inputFormat={INPUT_DATE_FORMAT}
                          value={field.value}
                          onChange={field.onChange}
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={!!errors.ofstedRating}
                              helperText={errors.ofstedRating?.message}
                              label={t(
                                'pages.edit-org-details.ofsted-last-inspection'
                              )}
                              variant="filled"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle2" mb={1}>
              {t('pages.edit-org-details.address')}
            </Typography>

            <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
              <Box mb={3}>
                <TextField
                  id="line1"
                  label={t('common.addr.line1')}
                  variant="filled"
                  error={!!errors.line1}
                  helperText={errors.line1?.message}
                  {...register('line1')}
                  inputProps={{ 'data-testid': 'line1' }}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <TextField
                  id="line2"
                  label={t('common.addr.line2')}
                  variant="filled"
                  error={!!errors.line2}
                  helperText={errors.line2?.message}
                  {...register('line2')}
                  inputProps={{ 'data-testid': 'line2' }}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <TextField
                  id="city"
                  label={t('common.addr.city')}
                  variant="filled"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  {...register('city')}
                  inputProps={{ 'data-testid': 'city' }}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <TextField
                  id="country"
                  label={t('common.addr.country')}
                  variant="filled"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  {...register('country')}
                  inputProps={{ 'data-testid': 'country' }}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <TextField
                  id="postCode"
                  label={t('common.addr.postCode')}
                  variant="filled"
                  error={!!errors.postCode}
                  helperText={errors.postCode?.message}
                  {...register('postCode')}
                  inputProps={{ 'data-testid': 'postCode' }}
                  fullWidth
                />
              </Box>
            </Box>

            <Typography variant="subtitle2" mb={1}>
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
                href="..?tab=DETAILS"
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
