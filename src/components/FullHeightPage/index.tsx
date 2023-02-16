import { Box } from '@mui/material'
import { BoxProps } from '@mui/system'
import React from 'react'

import { APP_BAR_HEIGHT, FOOTER_HEIGHT } from '@app/theme'

const HEIGHT_TO_REDUCE = APP_BAR_HEIGHT + FOOTER_HEIGHT

export const FullHeightPage: React.FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  return (
    <Box {...props} minHeight={`calc(100vh - ${HEIGHT_TO_REDUCE}px)`}>
      {children}
    </Box>
  )
}
