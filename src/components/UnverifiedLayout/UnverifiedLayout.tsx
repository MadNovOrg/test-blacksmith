import { AppBar, Box, Button, Toolbar } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@app/components/Logo'
import { useAuth } from '@app/context/auth'

import { LinkBehavior } from '../LinkBehavior'

type Props = {
  width?: number
}

export const UnverifiedLayout: React.FC<Props> = ({
  width = 500,
  children,
}) => {
  const { t } = useTranslation()
  const { logout } = useAuth()

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
      <AppBar color="transparent" elevation={0} variant="elevation">
        <Toolbar
          sx={{ justifyContent: 'space-between', bgcolor: 'common.white' }}
        >
          <Box />
          <Box display="flex" alignItems="center">
            <Logo
              width={230}
              height={48}
              variant="full"
              data-testid="app-logo"
            />
          </Box>
          <Box>
            <Button
              variant="text"
              component={LinkBehavior}
              color="primary"
              href="/verify"
              size="small"
            >
              {t('verify')}
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={logout}
              size="small"
            >
              {t('logout')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
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
