import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState } from 'react'

import { Dialog } from '@app/components/dialogs'
import {
  DeleteProfileMutation,
  DeleteProfileMutationVariables,
  DeleteUserError,
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
        if (deleteUser.error === DeleteUserError.CertExist) {
          return setError(t('no-delete-certified'))
        }
        if (deleteUser.error === DeleteUserError.UserTrainer) {
          return setError(
            t('no-delete-trainer', { courseIds: deleteUser.courseIds })
          )
        }
        if (deleteUser.error === DeleteUserError.PendingCourse) {
          return setError(
            t('no-delete-active-course', { courseIds: deleteUser.courseIds })
          )
        }
        return setError(t('delete-error'))
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
        <>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('confirmation-title', {
              firstName: profile.givenName,
              lastName: profile.familyName,
              email: profile.email,
            })}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('confirmation-message')}
          </Typography>

          <Alert severity="warning" variant="outlined" sx={{ mb: 2, mt: 2 }}>
            {t('confirmation-warning')}
          </Alert>
        </>
      ) : null}

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={onClose}>{_t('cancel')}</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          onClick={onSubmit}
          loading={saving}
          color="error"
        >
          {t('delete')}
        </LoadingButton>
      </Box>
    </Dialog>
  )
}
