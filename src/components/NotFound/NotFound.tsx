import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const NotFound = () => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Typography variant="h2" mt={10}>
        {t('components.not-found.title')}
      </Typography>
      <Typography variant="body1" mt={4}>
        {t('components.not-found.info')}
      </Typography>
    </Box>
  )
}
