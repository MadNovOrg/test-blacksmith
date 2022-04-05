import { Box } from '@mui/material'
import React from 'react'

import { ReactComponent as LogoSvg } from './logo-color.svg'

export const Logo: React.FC<{ size: number }> = ({ size = 40, ...rest }) => (
  <Box display="inline-block" height={size} width={size}>
    <LogoSvg width={size} height={size} {...rest} />
  </Box>
)
