import { Button, Typography } from '@mui/material'
import { t } from 'i18next'
import { useCallback, ChangeEvent, FC, useRef } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Avatar } from '@app/components/Avatar'
import { useAuth } from '@app/context/auth'

import useProfile from '../../hooks/useProfile/useProfile'
import { EditProfileInputs } from '../../pages/EditProfile/utils'
import { avatarSize, maxAvatarFileSizeBytes } from '../../utils'

type Props = {
  setValue: UseFormSetValue<EditProfileInputs>
  values: EditProfileInputs
  loading: boolean
}

export const UploadAvatar: FC<Props> = ({ setValue, values, loading }) => {
  const avatarErrorRef = useRef('')

  const { updateAvatar } = useProfile()
  const { profile: currentProfile } = useAuth()
  const { id } = useParams()

  const editedProfileId = id ?? currentProfile?.id

  const handleAvatarUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) {
        return
      }
      const file = e.target.files[0]
      if (file.size > maxAvatarFileSizeBytes) {
        avatarErrorRef.current = t('avatar-too-large', {
          maxSize: maxAvatarFileSizeBytes / (1024 * 1024),
        })
        return
      }

      try {
        avatarErrorRef.current = ''
        const buffer = await file.arrayBuffer()
        const data = Array.from(new Uint8Array(buffer))

        const response = await updateAvatar({
          avatar: data,
          profileId: editedProfileId as string,
        })

        setValue('avatar', response?.data?.updateAvatar?.avatar)
      } catch (err) {
        avatarErrorRef.current = t('avatar-upload-error')
      }
    },
    [avatarErrorRef, setValue, updateAvatar, editedProfileId],
  )
  return (
    <>
      <Button
        component="label"
        sx={{
          alignItems: 'normal',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0)' },
          borderRadius: '50%',
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          marginBottom: 4,
          padding: 0,
        }}
      >
        <Avatar
          src={values.avatar ?? undefined}
          name={`${values.firstName} ${values.surname}`}
          size={avatarSize}
          sx={{
            mb: 4,
            opacity: loading ? 0.3 : 1,
          }}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleAvatarUpload}
          data-testid="avatar-input"
        />
      </Button>
      {avatarErrorRef.current ? (
        <Typography variant="caption" color="error">
          {avatarErrorRef.current}
        </Typography>
      ) : null}
    </>
  )
}
