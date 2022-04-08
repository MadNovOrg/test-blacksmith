import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'

export const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Stack flex={1} alignItems="center">
      <Typography variant="h2" mt={10}>
        {t('components.not-found.title')}
      </Typography>
      <Typography variant="body1" mt={4}>
        {t('components.not-found.info')}
      </Typography>

      <Button
        component={LinkBehavior}
        href="/"
        variant="contained"
        color="primary"
        size="small"
        sx={{ mt: 4 }}
      >
        {t('home')}
      </Button>
    </Stack>
  )
}
