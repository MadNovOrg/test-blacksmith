import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'

type Props = {
  showTitle?: boolean
  title?: string
  description?: string
}

export const NotFound: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  description,
  showTitle = true,
}) => {
  const { t } = useTranslation()

  return (
    <Stack flex={1} alignItems="center">
      {showTitle ? (
        <Typography variant="h2" mt={10}>
          {title ? title : t('components.not-found.title')}
        </Typography>
      ) : null}
      <Typography variant="body1" mt={4} textAlign={'center'}>
        {description ?? t('components.not-found.info')}
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
