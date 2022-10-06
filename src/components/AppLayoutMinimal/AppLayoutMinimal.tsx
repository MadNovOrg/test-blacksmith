import { Box, SxProps } from '@mui/material'
import React from 'react'

import { Logo } from '@app/components/Logo'

type Props = {
  width?: number
  contentBoxStyles?: SxProps
  footer?: React.ReactElement
}

export const AppLayoutMinimal: React.FC<Props> = ({
  width = 500,
  contentBoxStyles,
  children,
  footer,
}) => {
  return (
    <Box
      bgcolor="grey.200"
      width="100%"
      height="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="scroll"
    >
      <Logo width={80} height={80} />
      <Box
        mt={3}
        bgcolor="common.white"
        py={5}
        px={8}
        borderRadius={2}
        width={width}
        position="relative"
        sx={contentBoxStyles}
      >
        {children}
      </Box>
      {footer}
    </Box>
  )
}
