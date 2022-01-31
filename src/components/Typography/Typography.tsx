import clsx from 'clsx'
import React from 'react'

type Variant =
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'subtitle3'
  | 'body1'
  | 'body2'
  | 'body3'

export type TypographyProps = {
  variant?: Variant
  children: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
} & React.HTMLAttributes<HTMLParagraphElement>

const variants: Record<Variant, string> = {
  h3: 'text-4xl',
  h4: 'font-light text-2xl sm:text-4xl',
  h5: 'text-2xl',
  h6: 'text-2xl font-light',
  subtitle1: 'text-base font-bold',
  subtitle2: 'text-lg',
  subtitle3: 'text-lg font-light',
  body1: 'text-base',
  body2: 'text-sm',
  body3: 'text-sm	font-light',
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
  className,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <div
      className={clsx('flex items-center', variants[variant], className)}
      {...props}
    >
      {startIcon && <div className="mr-2">{startIcon}</div>}
      {children}
      {endIcon && <div className="ml-2">{endIcon}</div>}
    </div>
  )
}
