import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
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
import { useParams } from 'react-router-dom'

import { FormPanel } from '@app/components/FormPanel'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { SAVE_ORG_INVITES_MUTATION } from '@app/queries/invites/save-org-invites'
import { Organization } from '@app/types'

export type ImportCertificateModalProps = {
  email: string
  onClose: () => void
}

export const InviteUserToOrganisation: React.FC<
  React.PropsWithChildren<ImportCertificateModalProps>
> = ({ email, onClose }) => {
  const theme = useTheme()
  const { acl, profile } = useAuth()
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOrgAdmin, setIsOrgAdmin] = useState(false)
  const { id } = useParams()
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()
  const userInvited = Boolean(getSnackbarMessage('user-invited'))

  const where = useMemo(
    () =>
      acl.isOrgAdmin() && !acl.isInternalUser()
        ? {
            members: {
              _and: {
                isAdmin: { _eq: true },
                profile_id: { _eq: profile?.id },
              },
            },
          }
        : undefined,
    [acl, profile]
  )

  const { orgs, loading: loadingOrgs } = useOrganizations(undefined, where)

  const { handleSubmit } = useForm<{ emails: string[] }>()

  useEffect(() => {
    if (orgs.length > 0 && !selectedOrg && id) {
      setSelectedOrg(orgs.find(o => o.id === id) ?? null)
    }
  }, [id, orgs, selectedOrg])

  const submit = async () => {
    setError('')
    if (!selectedOrg) return
    setLoading(true)
    try {
      await fetcher(SAVE_ORG_INVITES_MUTATION, {
        invites: [
          {
            email,
            orgId: selectedOrg.id,
            isAdmin: isOrgAdmin,
          },
        ],
      })
      if (!userInvited) {
        addSnackbarMessage('user-invited', {
          label: t('pages.invite-to-org.user-invited-success'),
        })
      }
      onClose()
    } catch (e: unknown) {
      const errorMessage = (e as Error).message
      setError(
        errorMessage.includes('organization_invites_org_id_email_key')
          ? t('pages.invite-to-org.duplicate-email')
          : errorMessage
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingOrgs) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="edit-org-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Box
      display="flex"
      component="form"
      onSubmit={handleSubmit(submit)}
      p={3}
      noValidate
      autoComplete="off"
      aria-autocomplete="none"
      data-testid="edit-invite-user"
    >
      <Box flex={1}>
        <Box display="flex" flexDirection="column" gap={2}>
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
              data-testid="edit-invite-user-org-selector"
              onChange={(e, v) => setSelectedOrg(v)}
            />
          </FormPanel>

          {acl.canSetOrgAdminRole() ? (
            <>
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
            </>
          ) : undefined}

          {error ? <Alert severity="error">{error}</Alert> : null}

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
              onClick={() => onClose()}
            >
              {t('common.cancel')}
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
              data-testid="edit-invite-user-submit-btn"
              size="large"
              disabled={!selectedOrg}
            >
              {t('pages.invite-to-org.invite-user')}
            </LoadingButton>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
