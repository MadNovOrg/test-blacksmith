import { Box } from '@mui/material'
import React from 'react'

type Props = unknown

export const UnverifiedLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <Box bgcolor="grey.200" flex={1}>
      {children}
    </Box>
  )
}
