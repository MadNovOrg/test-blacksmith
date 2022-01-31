import React from 'react'
import { Link } from 'react-router-dom'

import { Typography } from '../Typography'

export type CustomLinkProps = {
  to: string
  children: React.ReactNode
  className?: string
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  to,
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <Link to={to} className="underline" {...props}>
        <Typography variant="body4">{children}</Typography>
      </Link>
    </div>
  )
}
