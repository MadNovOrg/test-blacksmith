import { Typography, SxProps } from '@mui/material'
import React from 'react'

type Props = {
  children?: React.ReactNode
  sx?: SxProps
}

export const Title: React.FC<Props> = ({ children, sx }) => (
  <Typography
    variant="body1"
    sx={{ fontWeight: 'bold', marginBottom: 1, ...sx }}
  >
    {children}
  </Typography>
)
