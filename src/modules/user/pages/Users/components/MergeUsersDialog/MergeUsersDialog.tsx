import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs/Dialog'
import {
  GetProfileDetailsQuery,
  MergeUserMutation,
  MergeUserMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { Avatar } from '@app/modules/profile/components/Avatar'
import useProfile from '@app/modules/profile/hooks/useProfile'
import { MERGE_USERS_MUTATION } from '@app/modules/user/queries/merge-users'
import { LoadingStatus } from '@app/util'

type Props = {
  onClose: () => void
  onSuccess: () => void
  profileId1: string
  profileId2: string
}

const UserSummary: React.FC<{ profile: GetProfileDetailsQuery['profile'] }> = ({
  profile,
}) => {
  const { t } = useTranslation()

  if (!profile) return null

  return (
    <Box>
      <Box display="flex" alignItems="center" pt={1} mb={3}>
        <Avatar
          src={profile.avatar ?? undefined}
          name={profile.fullName ?? undefined}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          {profile.fullName}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ py: 2, mb: 1 }}>
        {profile.email}
      </Typography>

      <Typography variant="body2" sx={{ py: 2, mb: 1 }}>
        {profile.organizations[0]?.organization.name || t('no-organization')}
      </Typography>

      <Box py={2}>
        {profile.roles.map(r => (
          <Chip
            key={r.role.id}
            label={t(`pages.view-profile.roles.${r.role.name}`)}
            color="info"
            size="small"
          />
        ))}
      </Box>
    </Box>
  )
}

export const MergeUsersDialog: React.FC<Props> = ({
  onClose,
  onSuccess,
  profileId1,
  profileId2,
}) => {
  const { t, _t } = useScopedTranslation('pages.admin.users.merge-users-dialog')
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [primaryUser, setPrimaryUser] = useState<string>()
  const [mergeWith, setMergeWith] = useState<string>()
  const { profile: profile1, status: status1 } = useProfile(profileId1)
  const { profile: profile2, status: status2 } = useProfile(profileId2)

  const [{ fetching: saving }, mergeUsers] = useMutation<
    MergeUserMutation,
    MergeUserMutationVariables
  >(MERGE_USERS_MUTATION)
  const allowMerge = confirmed && primaryUser && mergeWith

  const handleMerge = async () => {
    if (!allowMerge) return
    setError(null)
    const { data: response, error: mergeUsersError } = await mergeUsers({
      primaryUser,
      mergeWith,
    })
    if (mergeUsersError || response?.mergeUser.error) {
      return setError('merge-error')
    }
    onSuccess()
  }

  const isLoading =
    LoadingStatus.FETCHING === status1 || LoadingStatus.FETCHING === status2
  const isLoaded = profile1 && profile2

  return (
    <Dialog
      open
      onClose={onClose}
      title={<Typography variant="h2">{t('compare-users')}</Typography>}
      maxWidth={900}
    >
      {!isLoading && !isLoaded && (
        <Box display="flex" justifyContent="center" my={2}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {t('no-profiles')}
          </Alert>
        </Box>
      )}

      {isLoaded && (
        <>
          <Alert
            severity="success"
            color="warning"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {t('merge-warning')}
          </Alert>
          <Box mb={3}>
            <Box display="flex" alignItems="flex-start">
              <Typography sx={{ width: 150, py: 2 }}>
                {t('primary-user')}
              </Typography>
              <RadioGroup
                aria-labelledby="user-radio-group-label"
                name="user-radio-group"
                row
                sx={{
                  flex: 1,
                  px: 1,
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                }}
                onChange={e => {
                  setPrimaryUser(e.target.value)
                  setMergeWith(
                    e.target.value === profile1.id ? profile2.id : profile1.id,
                  )
                }}
              >
                <FormControlLabel
                  sx={{
                    flex: 1,
                    alignItems: 'flex-start',
                    m: 0,
                    bgcolor: 'grey.100',
                    py: 1,
                    borderStyle: 'solid',
                    borderColor: theme =>
                      primaryUser === profile1.id
                        ? theme.colors.lime[500]
                        : 'transparent',
                    borderWidth: 1,
                  }}
                  name="primary-user"
                  value={profile1.id}
                  control={<Radio inputProps={{ role: 'radio' }} />}
                  label={<UserSummary profile={profile1} />}
                />

                <FormControlLabel
                  sx={{
                    flex: 1,
                    alignItems: 'flex-start',
                    m: 0,
                    bgcolor: 'grey.100',
                    py: 1,
                    borderStyle: 'solid',
                    borderColor: theme =>
                      primaryUser === profile2.id
                        ? theme.colors.lime[500]
                        : 'transparent',
                    borderWidth: 1,
                  }}
                  name="merge-with"
                  value={profile2.id}
                  control={<Radio inputProps={{ role: 'radio' }} />}
                  label={<UserSummary profile={profile2} />}
                />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography sx={{ width: 150 }}> </Typography>
              <Box display="flex" flex={1} mt={1}>
                <Typography
                  variant="caption"
                  sx={{ flex: 1 }}
                  color="dimGrey.main"
                >
                  {t('last-updated')}{' '}
                  {_t('dates.fullDateInSentence', {
                    date: new Date(profile1.updatedAt),
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ flex: 1 }}
                  color="dimGrey.main"
                >
                  {t('last-updated')}{' '}
                  {_t('dates.fullDateInSentence', {
                    date: new Date(profile2.updatedAt),
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>

          {error && (
            <Box display="flex" justifyContent="center">
              <Typography color="error" variant="caption">
                {t(error)}
              </Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center">
            <FormControlLabel
              name="confirm-merge"
              sx={{ flex: 1 }}
              control={
                <Checkbox
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                />
              }
              label={
                <Typography variant="caption">{t('confirm-merge')}</Typography>
              }
            />
            <Box>
              <Button variant="text" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                disabled={!allowMerge || saving}
                onClick={handleMerge}
              >
                {t('continue')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Dialog>
  )
}
