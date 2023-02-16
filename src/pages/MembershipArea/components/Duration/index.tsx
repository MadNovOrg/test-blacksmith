import { Typography, TypographyProps } from '@mui/material'
import { format } from 'date-fns'
import React from 'react'

type Props = {
  duration?: number
} & TypographyProps

export const Duration: React.FC<React.PropsWithChildren<Props>> = ({
  duration,
  ...rest
}) => (
  <Typography {...rest}>
    {typeof duration === 'number' ? format(duration * 1000, 'mm:ss') : '--:--'}
  </Typography>
)
