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
import { useMutation } from 'urql'

import { FormPanel } from '@app/components/FormPanel'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  SaveOrganisationInvitesMutation,
  SaveOrganisationInvitesMutationVariables,
  SaveOrgInviteError,
} from '@app/generated/graphql'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { SAVE_ORGANISATION_INVITES_MUTATION } from '@app/queries/invites/save-org-invites'
import { Organization } from '@app/types'

export type InviteUserToOrganisationProps = {
  userProfile: {
    email?: string | null | undefined
    organizations: Array<{
      organization: {
        id: string
      }
    }>
  }
  onClose: () => void
}

export const InviteUserToOrganisation: React.FC<
  React.PropsWithChildren<InviteUserToOrganisationProps>
> = ({ userProfile, onClose }) => {
  const theme = useTheme()
  const { acl, profile } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isOrgAdmin, setIsOrgAdmin] = useState(false)
  const { id } = useParams()
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()
  const userInvited = Boolean(getSnackbarMessage('user-invited'))

  const [{ data, fetching, error: errorOnInviteSave }, saveOrgInvite] =
    useMutation<
      SaveOrganisationInvitesMutation,
      SaveOrganisationInvitesMutationVariables
    >(SAVE_ORGANISATION_INVITES_MUTATION)

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

  const isUserAlreadyInOrganisation = (
    user: typeof userProfile,
    orgId: string
  ) => user.organizations.some(o => o.organization.id === orgId)

  useEffect(() => {
    if (orgs.length > 0 && !selectedOrg && id) {
      setSelectedOrg(orgs.find(o => o.id === id) ?? null)
    }
  }, [id, orgs, selectedOrg])

  useEffect(() => {
    if (data && !userInvited) {
      addSnackbarMessage('user-invited', {
        label: t('pages.invite-to-org.user-invited-success'),
      })

      onClose()
    }
  }, [addSnackbarMessage, data, errorOnInviteSave, onClose, t, userInvited])

  const submit = async () => {
    setError('')

    if (!selectedOrg) return

    if (
      userProfile &&
      isUserAlreadyInOrganisation(userProfile, selectedOrg.id)
    ) {
      setError(t('pages.invite-to-org.duplicate-email'))
      return
    }

    if (userProfile.email) {
      await saveOrgInvite({
        invites: [
          {
            isAdmin: isOrgAdmin,
            orgId: selectedOrg.id,
            profileEmail: userProfile.email,
          },
        ],
      })
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

          {error || errorOnInviteSave ? (
            <Alert severity="error">
              {error
                ? error
                : errorOnInviteSave?.message.includes(
                    SaveOrgInviteError.OrgMemberAlreadyExists
                  )
                ? t('pages.invite-to-org.duplicate-email')
                : t('internal-error')}
            </Alert>
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
              onClick={() => onClose()}
            >
              {t('common.cancel')}
            </Button>
            <LoadingButton
              loading={fetching}
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
