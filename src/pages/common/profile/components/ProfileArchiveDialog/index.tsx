import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import { noop } from 'ts-essentials'

import { Dialog } from '@app/components/Dialog'
import useProfile from '@app/hooks/useProfile'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export type Props = {
  onClose?: () => void
  profileId: string
}

export const ProfileArchiveDialog: React.FC<React.PropsWithChildren<Props>> = ({
  onClose = noop,
  profileId,
}) => {
  const { t, _t } = useScopedTranslation('components.profile-archive-dialog')

  const [error, setError] = React.useState<string>()

  const { profile, archive } = useProfile(profileId)

  const onSubmit = async () => {
    setError(undefined)
    try {
      await archive()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
    onClose()
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
        <LoadingButton type="submit" variant="contained" onClick={onSubmit}>
          {t('archive')}
        </LoadingButton>
      </Box>
    </Dialog>
  )
}
