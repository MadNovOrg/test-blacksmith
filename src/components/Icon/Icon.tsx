import clsx from 'clsx'
import React from 'react'

import icons from './icons'

type CustomIcons = keyof typeof icons

export type IconProps = {
  name: CustomIcons
  className?: string
}

const DEFAULT_CLASSES = 'text-2xl'

export const Icon: React.FC<IconProps> = ({
  name,
  className = DEFAULT_CLASSES,
  ...props
}) => {
  const Comp = icons[name]

  return <Comp {...props} className={clsx('cursor-pointer', className)} />
}
