import clsx from 'clsx'
import React from 'react'

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary' | 'tagOne' | 'tagTwo'
  type?: 'button' | 'submit' | 'reset'
  children?: React.ReactNode
  className?: string
}

export const Button: React.FC<
  ButtonProps & React.HTMLProps<HTMLButtonElement>
> = ({ variant, type = 'button', children, className = '', ...props }) => {
  let extraClassName
  switch (variant) {
    case 'primary':
      extraClassName = 'btn btn-primary'
      break
    case 'secondary':
      extraClassName = 'btn btn-secondary'
      break
    case 'tertiary':
      extraClassName = 'btn btn-tertiary'
      break
    case 'tagOne':
      extraClassName = 'btn btn-tagOne'
      break
    case 'tagTwo':
      extraClassName = 'btn btn-tagTwo'
      break
    default:
      extraClassName = 'btn btn-primary'
  }

  return (
    <button {...props} className={clsx(className, extraClassName)} type={type}>
      {children}
    </button>
  )
}
