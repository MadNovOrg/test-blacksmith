import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const SuspenseLoading: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={5}>
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ mt: 2, fontSize: 12 }}>
        {t('components.suspense-loading.text')}
      </Typography>
    </Box>
  )
}
