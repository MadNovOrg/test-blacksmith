import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { FormPanel } from '@app/components/FormPanel'
import { InfoPanel } from '@app/components/InfoPanel'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  SaveOrganisationInvitesMutation,
  SaveOrganisationInvitesMutationVariables,
  SaveOrgInviteError,
} from '@app/generated/graphql'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { OrgDashboardTabs } from '@app/modules/organisation/pages/OrganisationDashboard/OrgDashboard'
import { OrgIndividualsSubtabs } from '@app/modules/organisation/tabs/OrgIndividualsTab'
import { SAVE_ORGANISATION_INVITES_MUTATION } from '@app/queries/invites/save-org-invites'
import { yup } from '@app/schemas'
import { Organization } from '@app/types'
import { getFieldError, requiredMsg } from '@app/util'

export const InviteUserToOrganization = () => {
  const theme = useTheme()
  const { acl, profile } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  const { orgs, loading: loadingOrgs } = useOrganizations(
    undefined,
    profile && acl.isOrgAdmin() && !acl.canViewAllOrganizations()
      ? {
          members: {
            _and: [
              {
                profile_id: { _eq: profile.id },
              },
              {
                isAdmin: { _eq: true },
              },
            ],
          },
        }
      : undefined
  )

  const schema = useMemo(() => {
    return yup.object({
      isOrgAdmin: yup.boolean(),
      emails: yup
        .array()
        .of(
          yup
            .string()
            .email(t('validation-errors.email-invalid'))
            .required(t('validation-errors.email-invalid'))
        )
        .required()
        .min(1, requiredMsg(t, 'pages.invite-to-org.work-email')),
    })
  }, [t])

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    setValue,
    control,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      emails: [],
      isOrgAdmin: false,
    },
  })

  const values = watch()

  useEffect(() => {
    if (orgs.length > 0 && !selectedOrg && id) {
      setSelectedOrg(orgs.find(o => o.id === id) ?? null)
    }
  }, [id, orgs, selectedOrg])

  const [
    { data: savingInvitesResponse, error: savingError, fetching: loading },
    saveOrgInvites,
  ] = useMutation<
    SaveOrganisationInvitesMutation,
    SaveOrganisationInvitesMutationVariables
  >(SAVE_ORGANISATION_INVITES_MUTATION)

  console.log(savingError?.message)

  const errorMessage = savingError
    ? savingError?.message.includes(SaveOrgInviteError.OrgMemberAlreadyExists)
      ? t('pages.invite-to-org.duplicate-email')
      : t('pages.invite-to-org.error-message')
    : null

  const onSubmit: SubmitHandler<
    yup.InferType<typeof schema>
  > = async values => {
    if (!selectedOrg) return

    await saveOrgInvites({
      invites: values.emails.map(email => ({
        isAdmin: Boolean(values.isOrgAdmin),
        orgId: selectedOrg.id,
        profileEmail: email,
      })),
    })
  }

  if (loadingOrgs) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="org-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (savingInvitesResponse?.saveOrgInvites?.success) {
    return (
      <Navigate
        to={`../?tab=${OrgDashboardTabs.INDIVIDUALS}&subtab=${OrgIndividualsSubtabs.INVITES}`}
      />
    )
  }

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box
          display={{ md: 'flex' }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          aria-autocomplete="none"
        >
          <Box width={400} display="flex" flexDirection="column" pr={{ md: 6 }}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton />
              </Box>
              <Box>
                <Typography variant="h2" mb={2}>
                  {t('pages.invite-to-org.title')}
                </Typography>

                <Typography color={theme.palette.grey[700]}>
                  {t('common.all-fields-are-mandatory')}
                </Typography>
              </Box>
            </Sticky>
          </Box>

          <Box flex={1} paddingBottom={5}>
            <Box display="flex" flexDirection="column" gap={2} mt={8}>
              <Stack spacing={4} mb={6}>
                <InfoPanel title={t('organization')} titlePosition="outside">
                  <FormPanel>
                    <Autocomplete
                      value={selectedOrg}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      getOptionLabel={o => o.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          required
                          variant="filled"
                          label={t('organization')}
                          inputProps={{
                            ...params.inputProps,
                            sx: { height: 40 },
                          }}
                          sx={{ bgcolor: 'grey.100' }}
                        />
                      )}
                      options={orgs}
                      onChange={(e, v) => setSelectedOrg(v)}
                    />
                  </FormPanel>
                </InfoPanel>

                <InfoPanel
                  titlePosition="outside"
                  title={t('pages.invite-to-org.user-details')}
                >
                  <FormPanel>
                    {errorMessage ? (
                      <Alert
                        variant="outlined"
                        severity="error"
                        data-testid="error-alert"
                        sx={{ mb: 4 }}
                      >
                        {errorMessage}
                      </Alert>
                    ) : null}

                    <Autocomplete
                      multiple
                      id="emails"
                      options={[] as string[]}
                      value={values.emails}
                      freeSolo
                      autoSelect
                      onChange={(_, v) =>
                        setValue('emails', v, { shouldValidate: isSubmitted })
                      }
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          // disable key rule because getTagProps already sets correct key
                          // eslint-disable-next-line react/jsx-key
                          <Chip
                            variant="filled"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          required
                          variant="filled"
                          label={t('pages.invite-to-org.work-email')}
                          inputProps={{
                            ...params.inputProps,
                            sx: { height: 40 },
                            'data-testid': 'work-email-input',
                          }}
                          sx={{ bgcolor: 'grey.100' }}
                          error={!!errors.emails}
                          helperText={
                            errors.emails ? (
                              <Typography variant="caption">
                                {getFieldError(errors.emails)}
                              </Typography>
                            ) : null
                          }
                        />
                      )}
                    />

                    <FormHelperText>
                      {t('pages.invite-to-org.work-email-hint')}
                    </FormHelperText>

                    <Alert
                      variant="filled"
                      color="info"
                      severity="info"
                      sx={{ mt: 2 }}
                    >
                      <b>{t('important')}:</b> {t('pages.invite-to-org.notice')}
                    </Alert>
                  </FormPanel>
                </InfoPanel>

                {acl.canSetOrgAdminRole(selectedOrg?.id) ? (
                  <InfoPanel
                    title={t('pages.invite-to-org.permissions')}
                    titlePosition="outside"
                  >
                    <Controller
                      name="isOrgAdmin"
                      control={control}
                      render={({ field }) => (
                        <FormPanel>
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value === true}
                                sx={{ px: 2 }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1">
                                  {t('pages.invite-to-org.organization-admin')}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color={theme.palette.grey[700]}
                                >
                                  {t(
                                    'pages.invite-to-org.organization-admin-hint'
                                  )}
                                </Typography>
                              </Box>
                            }
                          />
                        </FormPanel>
                      )}
                    />
                  </InfoPanel>
                ) : null}
              </Stack>

              <Grid
                container
                width="100%"
                display="flex"
                justifyContent="space-between"
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
                  data-testid="invite-user-submit-btn"
                  size="large"
                >
                  {t('pages.invite-to-org.invite-users')}
                </LoadingButton>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
