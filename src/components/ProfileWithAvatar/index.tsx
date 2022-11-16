import { Box, Link, SxProps, Typography } from '@mui/material'
import React from 'react'

import { Avatar } from '@app/components/Avatar'

export type ProfileWithAvatarProps = {
  profile: {
    id: unknown
    avatar?: string | null
    fullName?: string | null
  }
  typographySx?: SxProps
  useLink?: boolean
}

export const ProfileWithAvatar: React.FC<ProfileWithAvatarProps> = ({
  profile,
  typographySx,
  useLink,
}) => {
  const avatar = (
    <Avatar src={profile.avatar ?? ''} name={profile.fullName ?? ''} />
  )
  const fullName = (
    <Typography variant="body2" sx={typographySx}>
      {profile.fullName}
    </Typography>
  )

  const link = `/profile/${profile.id}`

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {useLink ? (
        <>
          <Link href={link} underline="none">
            {avatar}
          </Link>
          <Link href={link}>{fullName}</Link>
        </>
      ) : (
        <>
          {avatar}
          {fullName}
        </>
      )}
    </Box>
  )
}
