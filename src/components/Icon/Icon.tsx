import clsx from 'clsx'
import React from 'react'

import icons, { AppIcons } from './icons'

type Size = 'sm' | 'md' | 'lg' | 'xl'

export type IconProps = {
  name: AppIcons
  size?: Size
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
}

export const Icon: React.FC<IconProps> = ({
  name,
  className,
  size = 'md',
  ...props
}) => {
  const Comp = icons[name]

  return (
    <Comp
      {...props}
      className={clsx('cursor-pointer', sizeClasses[size], className)}
    />
  )
}
