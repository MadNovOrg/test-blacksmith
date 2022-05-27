import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FormPanel } from '@app/components/FormPanel'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/organization/create-org'
import { yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

type FormInputs = { orgName: string; workEmail: string }

export const CreateOrganization = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const schema = useMemo(() => {
    return yup.object({
      orgName: yup
        .string()
        .required(
          requiredMsg(t, 'pages.create-organization.fields.organization-name')
        ),
      workEmail: yup
        .string()
        .email()
        .required(
          requiredMsg(t, 'pages.create-organization.fields.work-email')
        ),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      orgName: '',
      workEmail: '',
    },
  })

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetcher<ResponseType, ParamsType>(MUTATION, {
        name: data.orgName,
        attributes: {
          adminEmail: data.workEmail,
        },
      })
      navigate(`organizations/${response.org.id}`)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
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

                <Typography color={theme.palette.grey[700]}>
                  {t('common.all-fields-are-mandatory')}
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
                <TextField
                  id="orgName"
                  label={t(
                    'pages.create-organization.fields.organization-name'
                  )}
                  variant="standard"
                  error={!!errors.orgName}
                  helperText={errors.orgName?.message}
                  {...register('orgName')}
                  inputProps={{ 'data-testid': 'input-org-name' }}
                  sx={{ bgcolor: 'grey.100' }}
                  fullWidth
                  required
                />
              </FormPanel>

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
                  variant="standard"
                  error={!!errors.workEmail}
                  helperText={errors.workEmail?.message}
                  {...register('workEmail')}
                  inputProps={{ 'data-testid': 'input-admin-email' }}
                  sx={{ bgcolor: 'grey.100' }}
                  fullWidth
                  required
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
    </FullHeightPage>
  )
}
