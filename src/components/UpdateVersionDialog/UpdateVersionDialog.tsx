import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { Dialog } from '../dialogs'

export const UpdateVersionDialog = () => {
  const currentVersion = localStorage.getItem('appVersion')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { t } = useScopedTranslation('components.update-version-dialog')

  const [isOpen, setIsOpen] = useState<boolean>(
    currentVersion === 'undefined' || currentVersion !== PACKAGE_JSON_VERSION,
  )

  const handleUpdateVersionButtonClick = () => {
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
    setIsOpen(true)
  })

  if (PACKAGE_JSON_VERSION === currentVersion) return null

  return (
    <Dialog
      open={isOpen}
      showClose={false}
      onClose={(_?: object, reason?: string) => {
        if (reason === 'backdropClick') return
        setIsOpen(false)
      }}
      minWidth={400}
      disableEscapeKeyDown={true}
      slots={{
        Title: () => (
          <Alert
            severity="info"
            sx={{
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              padding: '0',
            }}
          >
            <Typography variant="h4">{t('title')}</Typography>
          </Alert>
        ),
        Content: () => <Typography>{t('content')}</Typography>,
        Actions: () => (
          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: !isMobile ? 'flex-end' : 'flex-start',
            }}
          >
            <Button
              variant="contained"
              data-testid="update-version-button"
              onClick={() => handleUpdateVersionButtonClick()}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <RefreshIcon />
                {t('update')}
              </Box>
            </Button>
          </Grid>
        ),
      }}
      contentSx={{ flexGrow: 0 }}
    />
  )
}
