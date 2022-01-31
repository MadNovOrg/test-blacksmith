import React from 'react'

import { IconProps, Icon } from '../Icon'

import { noop } from '@app/util'

export type IconButtonProps = {
  name: IconProps['name']
  onClick?: () => void
  className?: string
  size?: IconProps['size']
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  className,
  onClick = noop,
  size,
  ...props
}) => {
  return (
    <button
      className={`rounded-full bg-white/0 ripple-bg-grey7 p-2 ${className}`}
      onClick={onClick}
      {...props}
    >
      <Icon name={name} size={size} />
    </button>
  )
}
