import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
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
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useOrg from '@app/hooks/useOrg'
import {
  MUTATION as UPDATE_ORG_MUTATION,
  ParamsType as UpdateOrgParamsType,
  ResponseType as UpdateOrgResponseType,
} from '@app/queries/organization/update-org'
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
}

const TextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}))

export const EditOrgDetails: React.FC = () => {
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
    },
  })

  useEffect(() => {
    if (org) {
      setValue('orgName', org.name)
      setValue('trustType', org.trustType || TrustType.NOT_APPLICABLE)
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
    }
  }, [org, setValue])

  const onSubmit = async (data: OrgDetailsInput) => {
    if (!id) return

    setLoading(true)

    try {
      await fetcher<UpdateOrgResponseType, UpdateOrgParamsType>(
        UPDATE_ORG_MUTATION,
        {
          id,
          org: {
            name: data.orgName,
            trustType: data.trustType as TrustType,
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
          },
        }
      )

      setLoading(false)
      await mutate()
      navigate('..')
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
                  variant="standard"
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
                      variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                    variant="standard"
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
                    variant="standard"
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
                        variant="standard"
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
                              variant="standard"
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
              {t('pages.edit-org-details.additional-details')}
            </Typography>

            <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
              <Grid container spacing={3} mb={3}>
                <Grid item md={6}>
                  <TextField
                    id="headFirstName"
                    label={t('pages.edit-org-details.head-first-name')}
                    variant="standard"
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
                    variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
