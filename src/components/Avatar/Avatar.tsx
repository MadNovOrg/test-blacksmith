import { Avatar as MuiAvatar, SxProps } from '@mui/material'
import React from 'react'

import { getInitialsFromName, stringToColor } from '@app/util'

type AvatarProps = {
  name?: string
  src?: string
  size?: number
  sx?: SxProps
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size,
  sx,
  className,
}) => {
  const props = {
    src,
    className,
    sx: {
      ...(name && { bgcolor: stringToColor(name) }),
      ...(size && { width: size, height: size, fontSize: size / 2 }),
      ...sx,
    },
  }

  return (
    <MuiAvatar role="img" {...props}>
      {name ? getInitialsFromName(name) : null}
    </MuiAvatar>
  )
}
