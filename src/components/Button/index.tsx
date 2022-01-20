import React from 'react'

export type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary' | 'tagOne' | 'tagTwo'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
  let className = ''
  switch (variant) {
    case 'primary':
      className = 'btn btn-primary'
      break
    case 'secondary':
      className = 'btn btn-secondary'
      break
    case 'tertiary':
      className =
        'active:text-navy1 hover:text-navy2 text-primaryNavy rounded bg-white px-5 py-2.5 border'
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

  return <button className={className}>{children}</button>
}
