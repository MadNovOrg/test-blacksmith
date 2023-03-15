import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState } from 'react'

import { Dialog } from '@app/components/Dialog'
import {
  DeleteProfileMutation,
  DeleteProfileMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useProfile from '@app/hooks/useProfile'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { MUTATION as DELETE_PROFILE_MUTATION } from '@app/queries/profile/delete-profile'

export type Props = {
  onSuccess: () => void
  onClose: () => void
  profileId: string
}

export const ProfileDeleteDialog: React.FC<React.PropsWithChildren<Props>> = ({
  onSuccess,
  onClose,
  profileId,
}) => {
  const { t, _t } = useScopedTranslation('components.profile-delete-dialog')
  const [error, setError] = useState<string | null>()
  const [saving, setSaving] = useState(false)
  const fetcher = useFetcher()
  const { profile } = useProfile(profileId)

  const onSubmit = async () => {
    setSaving(true)
    setError(null)

    try {
      const { deleteUser } = await fetcher<
        DeleteProfileMutation,
        DeleteProfileMutationVariables
      >(DELETE_PROFILE_MUTATION, { profileId })
      setSaving(false)

      if (deleteUser.error) {
        return setError('delete-error')
      }

      onSuccess()
    } catch (e: unknown) {
      setSaving(false)
      setError((e as Error).message)
    }
  }

  return (
    <Dialog open={true} onClose={onClose} title={t('title')}>
      {error ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2, mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      {profile ? (
        <Typography variant="body2">
          {t('confirmation-message', {
            firstName: profile.givenName,
            lastName: profile.familyName,
            email: profile.email,
          })}
        </Typography>
      ) : null}

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={onClose}>{_t('cancel')}</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          onClick={onSubmit}
          loading={saving}
        >
          {t('delete')}
        </LoadingButton>
      </Box>
    </Dialog>
  )
}
