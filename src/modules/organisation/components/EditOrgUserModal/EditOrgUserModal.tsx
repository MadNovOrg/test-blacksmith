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
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  OrgMembersQuery,
  RemoveOrgMemberMutation,
  RemoveOrgMemberMutationVariables,
  UpdateOrgMemberMutation,
  UpdateOrgMemberMutationVariables,
} from '@app/generated/graphql'
import { REMOVE_ORG_MEMBER_MUTATION } from '@app/modules/profile/queries/remove-org-member'
import { UPDATE_ORG_MEMBER_MUTATION } from '@app/modules/profile/queries/update-org-member'
import theme from '@app/theme'

export type EditOrgUserModalProps = {
  orgMember: OrgMembersQuery['members'][0]
  onClose: () => void
  onChange?: () => void
  orgId: string
}

export const EditOrgUserModal: React.FC<
  React.PropsWithChildren<EditOrgUserModalProps>
> = function ({ orgMember, onClose, onChange, orgId }) {
  const { t } = useTranslation()
  const { acl, profile } = useAuth()
  const [error, setError] = useState<string>()
  const [isAdmin, setIsAdmin] = useState(orgMember.isAdmin)
  const [{ error: removeOrgMemberError }, removeOrgMember] = useMutation<
    RemoveOrgMemberMutation,
    RemoveOrgMemberMutationVariables
  >(REMOVE_ORG_MEMBER_MUTATION)

  const [{ error: updateOrgMemberError }, updateOrgMember] = useMutation<
    UpdateOrgMemberMutation,
    UpdateOrgMemberMutationVariables
  >(UPDATE_ORG_MEMBER_MUTATION)

  const onRemove = useCallback(async () => {
    await removeOrgMember({
      id: orgMember.id,
    })
    if (onChange) onChange()
    onClose()
    if (removeOrgMemberError) setError(removeOrgMemberError.message)
  }, [onChange, onClose, orgMember.id, removeOrgMember, removeOrgMemberError])

  const onSave = useCallback(async () => {
    await updateOrgMember({
      id: orgMember.id,
      member: { isAdmin: !!isAdmin },
    })
    if (onChange) onChange()
    onClose()
    if (updateOrgMemberError) setError(updateOrgMemberError.message)
  }, [
    isAdmin,
    onChange,
    onClose,
    orgMember.id,
    updateOrgMember,
    updateOrgMemberError,
  ])

  return (
    <Container data-testid="edit-org-member-modal">
      {acl.canSetOrgAdminRole(orgId) && profile?.id !== orgMember.profile.id ? (
        <FormControlLabel
          sx={{ py: 2 }}
          control={
            <Switch
              checked={isAdmin ?? false}
              onChange={e => {
                setIsAdmin(e.target.checked)
              }}
              sx={{ px: 2 }}
              data-testid="toggle-admin-role"
            />
          }
          label={
            <Box>
              <Typography variant="body1">
                {t(
                  'pages.org-details.tabs.users.edit-user-modal.organization-admin',
                )}
              </Typography>
              <Typography variant="body2" color={theme.palette.grey[700]}>
                {t(
                  'pages.org-details.tabs.users.edit-user-modal.organization-admin-hint',
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
            'pages.org-details.tabs.users.edit-user-modal.remove-from-organization',
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
            data-testid="cancel-edit-org-user"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={onSave}
            data-testid="confirm-edit-org-user"
          >
            {t('common.save-changes')}
          </Button>
        </Box>
      </Grid>
    </Container>
  )
}
