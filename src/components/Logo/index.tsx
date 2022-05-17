import { Box } from '@mui/material'
import React from 'react'

import { ReactComponent as LogoPartial } from './logo-color.svg'
import { ReactComponent as LogoFull } from './logo-full.svg'
import { ReactComponent as LogoPartialWhite } from './logo-white.svg'

const map = {
  partial: LogoPartial,
  full: LogoFull,
  white: LogoPartialWhite,
}

type LogoProps = {
  variant?: 'partial' | 'full' | 'white'
  width?: number
  height?: number
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'partial',
  width = 40,
  height = 40,
  ...rest
}) => {
  const Comp = map[variant]
  return (
    <Box display="flex" alignItems="center">
      <Comp width={width} height={height} {...rest} />
    </Box>
  )
}
