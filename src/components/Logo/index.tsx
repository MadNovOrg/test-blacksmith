import React from 'react'
import { styled } from '@mui/system'

import { ReactComponent as LogoSvg } from './logo-color.svg'

export const Logo = styled(props => <LogoSvg {...props} />)<{
  size?: number
}>(({ size = 40 }) => ({
  width: size,
  height: size,
}))
