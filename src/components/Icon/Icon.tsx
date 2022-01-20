import React from 'react'

import icons from './icons'

export type CustomIcons = keyof typeof icons

type IconProps = {
  name: CustomIcons
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const Comp = icons[name]

  return <Comp {...props} />
}
