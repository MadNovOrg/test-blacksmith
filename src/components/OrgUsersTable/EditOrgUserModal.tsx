import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  OrgMembersQuery,
  RemoveOrgMemberMutation,
  RemoveOrgMemberMutationVariables,
  UpdateOrgMemberMutation,
  UpdateOrgMemberMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION as RemoveOrgMemberQuery } from '@app/queries/organization/remove-org-member'
import { MUTATION as UpdateOrgMemberQuery } from '@app/queries/organization/update-org-member'
import theme from '@app/theme'

export type EditOrgUserModalProps = {
  orgMember: OrgMembersQuery['members'][0]
  onClose: () => void
  onChange?: () => void
}

export const EditOrgUserModal: React.FC<
  React.PropsWithChildren<EditOrgUserModalProps>
> = function ({ orgMember, onClose, onChange }) {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const fetcher = useFetcher()
  const [error, setError] = useState<string>()
  const [isAdmin, setIsAdmin] = useState(orgMember.isAdmin)

  const onRemove = useCallback(async () => {
    try {
      await fetcher<RemoveOrgMemberMutation, RemoveOrgMemberMutationVariables>(
        RemoveOrgMemberQuery,
        {
          id: orgMember.id,
        }
      )
      if (onChange) onChange()
      onClose()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }, [fetcher, onChange, onClose, orgMember])

  const onSave = useCallback(async () => {
    try {
      await fetcher<UpdateOrgMemberMutation, UpdateOrgMemberMutationVariables>(
        UpdateOrgMemberQuery,
        {
          id: orgMember.id,
          member: { isAdmin: !!isAdmin },
        }
      )
      if (onChange) onChange()
      onClose()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }, [fetcher, isAdmin, onChange, onClose, orgMember])

  return (
    <Container>
      {acl.canSetOrgAdminRole() ? (
        <FormControlLabel
          sx={{ py: 2 }}
          control={
            <Switch
              checked={isAdmin ?? false}
              onChange={e => {
                setIsAdmin(e.target.checked)
              }}
              sx={{ px: 2 }}
            />
          }
          label={
            <Box>
              <Typography variant="body1">
                {t(
                  'pages.org-details.tabs.users.edit-user-modal.organization-admin'
                )}
              </Typography>
              <Typography variant="body2" color={theme.palette.grey[700]}>
                {t(
                  'pages.org-details.tabs.users.edit-user-modal.organization-admin-hint'
                )}
              </Typography>
            </Box>
          }
        />
      ) : undefined}

      {error && <Alert severity="error">{error}</Alert>}

      <Grid
        container
        display="flex"
        justifyContent="space-between"
        gap={2}
        mt={2}
      >
        <Button
          data-testid="remove-from-organization"
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          onClick={onRemove}
        >
          {t(
            'pages.org-details.tabs.users.edit-user-modal.remove-from-organization'
          )}
        </Button>
        <Box>
          <Button
            type="button"
            variant="text"
            color="secondary"
            size="large"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={onSave}
          >
            {t('common.save-changes')}
          </Button>
        </Box>
      </Grid>
    </Container>
  )
}
