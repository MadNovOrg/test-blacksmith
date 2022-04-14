import { Box } from '@mui/material'
import React from 'react'

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
      <Logo width={80} height={80} />
      <Box
        mt={3}
        bgcolor="common.white"
        py={5}
        px={8}
        borderRadius={2}
        width={width}
        position="relative"
      >
        {children}
      </Box>
    </Box>
  )
}
