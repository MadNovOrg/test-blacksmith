import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import BannerBox from '@app/components/BannerBox'
import theme from '@app/theme'

import appStoreImage from './assets/app-store.png'
import googlePlayImage from './assets/google-play.png'
import phonesImage from './assets/phones.png'

export const AppBanner: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <BannerBox roundedCorners>
      {!hidden ? (
        <Box flex="1" textAlign="center">
          <img src={phonesImage} />
        </Box>
      ) : null}
      <Box flex={2}>
        <Typography variant="h1" color="primary" fontWeight={600} mb={3}>
          {t('pages.membership.components.app-banner.title')}
        </Typography>
        <Typography lineHeight={1.8} color={theme.palette.grey[800]}>
          {t('pages.membership.components.app-banner.description')}
        </Typography>
        <Box mt={4}>
          <img
            src={appStoreImage}
            height={65}
            style={{ marginRight: theme.spacing(2) }}
          />
          <img src={googlePlayImage} height={65} />
        </Box>
      </Box>
    </BannerBox>
  )
}
