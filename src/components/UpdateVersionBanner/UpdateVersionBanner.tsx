import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'

import { useSnackbar } from '@app/context/snackbar'

import { SnackbarMessage } from '../SnackbarMessage'

export const UpdateVersionBanner = () => {
  const currentVersion = localStorage.getItem('appVersion')
  const { t } = useTranslation()
  const { addSnackbarMessage, removeSnackbarMessage } = useSnackbar()

  const handleUpdateVersionButtonClick = () => {
    removeSnackbarMessage('version-update')
    localStorage.setItem('appVersion', PACKAGE_JSON_VERSION)
    if ('caches' in window) {
      caches
        .keys()
        .then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName)
          })
        })
        .then(() => {
          window.location.reload()
        })
    }
  }

  useEffectOnce(() => {
    addSnackbarMessage('version-update', {
      label: (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography>{t('version-update')}</Typography>
          <Button
            sx={{
              textTransform: 'capitalize',
              fontWeight: 'bold',
              color: 'rgb(13, 40, 96)',
            }}
            onClick={handleUpdateVersionButtonClick}
          >
            {t('update')}
          </Button>
        </Box>
      ),
    })
  })

  if (PACKAGE_JSON_VERSION === currentVersion) return null

  return (
    <SnackbarMessage
      autoHideDuration={null}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      severity="warning"
      alertProps={{
        sx: {
          alignItems: 'center',
          '& .MuiAlert-icon': {
            alignSelf: 'center',
          },
          backgroundColor: 'rgb(255, 248, 237)',
          borderColor: 'rgb(242, 166, 31)',
          color: 'rgb(102, 99, 94)',
          height: '56px',
        },
      }}
      messageKey="version-update"
      onClose={(_, reason?: string) => {
        if (reason === 'clickaway') return
      }}
    />
  )
}
