import { Box, SxProps, Typography } from '@mui/material'
import React from 'react'

import { Avatar } from '@app/components/Avatar'

export type ProfileWithAvatarProps = {
  profile: {
    avatar?: string | null
    fullName?: string | null
  }
  typographySx?: SxProps
}

export const ProfileWithAvatar: React.FC<ProfileWithAvatarProps> = ({
  profile,
  typographySx,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Avatar src={profile.avatar ?? ''} name={profile.fullName ?? ''} />
      <Typography variant="body2" sx={typographySx}>
        {profile.fullName}
      </Typography>
    </Box>
  )
}
