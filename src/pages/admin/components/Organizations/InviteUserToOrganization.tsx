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
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FormPanel } from '@app/components/FormPanel'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { OrgDashboardTabs } from '@app/pages/admin/components/Organizations/OrgDashboard'
import { OrgIndividualsSubtabs } from '@app/pages/admin/components/Organizations/tabs/OrgIndividualsTab'
import { MUTATION as SaveOrgInvitesQuery } from '@app/queries/invites/save-org-invites'
import { yup } from '@app/schemas'
import { Organization } from '@app/types'
import { getFieldError, requiredMsg } from '@app/util'

export const InviteUserToOrganization = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOrgAdmin, setIsOrgAdmin] = useState(false)
  const { id } = useParams()
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  const { orgs, loading: loadingOrgs } = useOrganizations()

  const emailsSchema = useMemo(() => {
    return yup.object({
      emails: yup
        .array()
        .of(
          yup
            .string()
            .email(t('validation-errors.email-invalid'))
            .required(t('validation-errors.email-invalid'))
        )
        .min(1, requiredMsg(t, 'pages.invite-to-org.work-email')),
    })
  }, [t])

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    setValue,
  } = useForm<{ emails: string[] }>({
    resolver: yupResolver(emailsSchema),
    defaultValues: {
      emails: [],
    },
  })

  const values = watch()

  useEffect(() => {
    if (orgs.length > 0 && !selectedOrg && id) {
      setSelectedOrg(orgs.find(o => o.id === id) ?? null)
    }
  }, [id, orgs, selectedOrg])

  const onSubmit = async () => {
    setLoading(true)
    setError('')
    if (!selectedOrg) return
    try {
      await fetcher(SaveOrgInvitesQuery, {
        invites: values.emails.map(email => ({
          email,
          orgId: selectedOrg.id,
          isAdmin: isOrgAdmin,
        })),
      })
      navigate(
        `../?tab=${OrgDashboardTabs.INDIVIDUALS}&subtab=${OrgIndividualsSubtabs.INVITES}`
      )
    } catch (e: unknown) {
      const errorMessage = (e as Error).message
      if (
        errorMessage.indexOf('organization_invites_org_id_email_key') !== -1
      ) {
        setError(t('pages.invite-to-org.duplicate-email'))
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
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
              <Typography variant="subtitle1">{t('organization')}</Typography>

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
                      inputProps={{ ...params.inputProps, sx: { height: 40 } }}
                      sx={{ bgcolor: 'grey.100' }}
                    />
                  )}
                  options={orgs}
                  onChange={(e, v) => setSelectedOrg(v)}
                />
              </FormPanel>

              <Typography variant="subtitle1">
                {t('pages.invite-to-org.user-details')}
              </Typography>

              <FormPanel>
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

              <Typography variant="subtitle1">
                {t('pages.invite-to-org.permissions')}
              </Typography>

              <FormPanel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isOrgAdmin}
                      onChange={e => {
                        setIsOrgAdmin(e.target.checked)
                      }}
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
                        {t('pages.invite-to-org.organization-admin-hint')}
                      </Typography>
                    </Box>
                  }
                />
              </FormPanel>

              {error ? (
                <FormPanel>
                  <FormHelperText
                    sx={{ mt: 2 }}
                    error
                    data-testid="invite-user-form-error"
                  >
                    {error}
                  </FormHelperText>
                </FormPanel>
              ) : null}

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
                  onClick={onSubmit}
                >
                  {t('pages.invite-to-org.invite-users')}
                </LoadingButton>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
