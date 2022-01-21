import React from 'react'

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary' | 'tagOne' | 'tagTwo'
  type?: 'button' | 'submit' | 'reset'
  children?: React.ReactNode
}

export const Button: React.FC<
  ButtonProps & React.HTMLProps<HTMLButtonElement>
> = ({ variant, type = 'button', children, ...props }) => {
  let className
  switch (variant) {
    case 'primary':
      className = 'btn btn-primary'
      break
    case 'secondary':
      className = 'btn btn-secondary'
      break
    case 'tertiary':
      className = 'btn btn-tertiary'
      break
    case 'tagOne':
      className = 'btn btn-tagOne'
      break
    case 'tagTwo':
      className = 'btn btn-tagTwo'
      break
    default:
      className = 'btn btn-primary'
  }

  return (
    <button {...props} className={className} type={type}>
      {children}
    </button>
  )
}
