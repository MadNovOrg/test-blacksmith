import React from 'react'

import { ReactComponent as LogoPartial } from './logo-color.svg'
import { ReactComponent as LogoFull } from './logo-full.svg'

const map = {
  partial: LogoPartial,
  full: LogoFull,
}

type LogoProps = {
  variant?: 'partial' | 'full'
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
  return <Comp width={width} height={height} {...rest} />
}
