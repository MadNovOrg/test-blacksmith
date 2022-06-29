import { Box, styled, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

import appStoreImage from './assets/app-store.png'
import googlePlayImage from './assets/google-play.png'
import bgImage from './assets/gradient-bg.png'
import phonesImage from './assets/phones.png'

const BannerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(5),
  background: `url('${bgImage}')`,
  backgroundSize: 'cover',
  borderRadius: 30,

  [theme.breakpoints.down('lg')]: {
    display: 'block',
    padding: theme.spacing(5),
    textAlign: 'center',
  },
}))

export const AppBanner: React.FC = () => {
  const { t } = useTranslation()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <BannerBox>
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
          Sapien, volutpat commodo aliquam justo odio. Condimentum in suscipit
          pretium commodo neque dictum nisl, diam, duis. Luctus eros, adipiscing
          ut fringilla sit platea elementum.
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
