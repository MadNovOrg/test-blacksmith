import clsx from 'clsx'
import React from 'react'

import icons from './icons'

export type CustomIcons = keyof typeof icons

type IconProps = {
  name: CustomIcons
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const Comp = icons[name]

  return (
    <Comp {...props} className={clsx('cursor-pointer text-2xl', className)} />
  )
}
