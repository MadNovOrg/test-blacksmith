import CloseIcon from '@mui/icons-material/Close'
import { Box, Link, Typography } from '@mui/material'
import { BoxProps } from '@mui/material/Box'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/modules/profile/components/Avatar'

type ProfileAvatarProps = {
  profile: {
    id?: string
    fullName?: string | null
    avatar?: string | null
    archived?: boolean | null
  }
  link?: string
  disableLink?: boolean
  renderLabel?: (label: string) => React.ReactNode
} & BoxProps

export const ProfileAvatar: React.FC<
  React.PropsWithChildren<ProfileAvatarProps>
> = ({ profile, link, disableLink, renderLabel, ...rest }) => {
  const { t } = useTranslation()

  const label = useMemo(() => {
    const labelName = profile.archived
      ? t('common.archived-profile')
      : profile.fullName ?? ''

    if (renderLabel) {
      return renderLabel(labelName)
    }
    return profile.id && !disableLink ? (
      <Link href={link ?? `/profile/${profile.id}`}>
        <Typography variant="body1">{labelName}</Typography>
      </Link>
    ) : (
      <Typography variant="body1">{labelName}</Typography>
    )
  }, [disableLink, link, profile, renderLabel, t])

  const avatar = profile.avatar ?? undefined
  const avatarName = profile.archived
    ? undefined
    : profile.fullName ?? undefined

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
      {...rest}
    >
      <Avatar src={avatar} name={avatarName}>
        {profile.archived ? <CloseIcon /> : null}
      </Avatar>

      {label ?? null}
    </Box>
  )
}
