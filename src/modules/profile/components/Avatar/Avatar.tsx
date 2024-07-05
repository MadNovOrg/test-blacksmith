import PersonIcon from '@mui/icons-material/Person'
import { Avatar as MuiAvatar, AvatarTypeMap, SxProps } from '@mui/material'
import React from 'react'

import { getInitialsFromName, stringToColor } from '@app/util'

type AvatarProps = {
  name?: string
  src?: string
  size?: number
  sx?: SxProps
  className?: string
  imgProps?: AvatarTypeMap['props']['imgProps']
}

export const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> =
  React.forwardRef<HTMLDivElement, React.PropsWithChildren<AvatarProps>>(
    function AvatarInner(
      { name, src, size = 32, sx, className, imgProps, children, ...rest },
      ref,
    ) {
      const props = {
        src,
        className,
        imgProps,
        sx: {
          ...(name && { bgcolor: stringToColor(name) }),
          ...sx,
          height: size,
          width: size,
        },
      }

      return (
        <MuiAvatar
          role="img"
          {...props}
          {...rest}
          ref={ref}
          style={{ fontSize: size / 2 }}
        >
          {name ? getInitialsFromName(name) : null}
          {children ? children : name ? null : <PersonIcon />}
        </MuiAvatar>
      )
    },
  )
