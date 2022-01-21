import React from 'react'

type Variant =
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'subtitle3'
  | 'body1'
  | 'body2'

export type TypographyProps = {
  variant?: Variant
  children: React.ReactNode
}

const variants: Record<Variant, string> = {
  h4: 'text-4xl',
  h5: 'text-2xl',
  h6: 'text-2xl font-thin',
  subtitle1: 'text-base font-bold',
  subtitle2: 'text-lg',
  subtitle3: 'text-lg font-thin',
  body1: 'text-base',
  body2: 'text-sm	font-thin',
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
}) => {
  return <p className={variants[variant]}>{children}</p>
}
