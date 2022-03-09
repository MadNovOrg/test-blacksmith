import React from 'react'
import { Box } from '@mui/material'

import { Logo } from '@app/components/Logo'

type Props = {
  width?: number
}

export const AppLayoutMinimal: React.FC<Props> = ({
  width = 500,
  children,
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
      <Logo size={80} />

      <Box
        mt={5}
        bgcolor="common.white"
        py={5}
        px={10}
        borderRadius={2}
        width={width}
        textAlign="center"
        position="relative"
      >
        {children}
      </Box>
    </Box>
  )
}
