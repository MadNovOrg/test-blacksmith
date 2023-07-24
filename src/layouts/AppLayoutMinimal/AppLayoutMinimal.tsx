import { Box, SxProps, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'

import { Logo } from '@app/components/Logo'

type Props = {
  width?: number
  contentBoxStyles?: SxProps
  footer?: React.ReactElement
}

export const AppLayoutMinimal: React.FC<React.PropsWithChildren<Props>> = ({
  width = 500,
  contentBoxStyles,
  children,
  footer,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      bgcolor={isMobile ? 'transparent' : 'grey.200'}
      width="100%"
      height="100%"
      p={isMobile ? 0 : 10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="scroll"
    >
      {isMobile ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent={'center'}
          width={'100%'}
          py={1}
          sx={{ borderBottom: 0.1, borderColor: 'grey.200' }}
        >
          <Logo width={230} height={48} variant="full" data-testid="app-logo" />
        </Box>
      ) : (
        <Logo width={80} height={80} />
      )}
      <Box
        mt={3}
        bgcolor="common.white"
        py={5}
        px={isMobile ? 4 : 8}
        borderRadius={2}
        position="relative"
        sx={contentBoxStyles}
        width={isMobile ? '100%' : width}
      >
        {children}
      </Box>
      {footer}
    </Box>
  )
}
