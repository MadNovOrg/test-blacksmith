import { Avatar as MuiAvatar, SxProps } from '@mui/material'
import React from 'react'

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

  const names = (name ?? '').split(' ')
  const [firstLetter = ''] = names[0]
  const [secondLetter = ''] = names.length > 1 ? names.slice(-1)[0] : []

  return (
    <MuiAvatar role="img" {...props}>
      {name ? firstLetter + secondLetter : null}
    </MuiAvatar>
  )
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}
