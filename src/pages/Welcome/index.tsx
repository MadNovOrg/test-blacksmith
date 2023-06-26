import { Button, Container, Grid, Link } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import BannerBox from '@app/components/BannerBox'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import jnImage from './assets/jn-image.png'
import signature from './assets/signature.png'

export const Welcome: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useScopedTranslation('pages.welcome')

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '2fr 1fr',
        height: '100%',
      }}
    >
      <BannerBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        height="100%"
        sx={{
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" sx={{ mb: 5 }}>
            <Typography variant="h1" fontWeight="600" mb={1}>
              {t('title')}
            </Typography>
          </Box>
          <Grid container spacing={5}>
            <Grid item md={5} xs={12}>
              <img src={jnImage} width="100%" alt={t('photo-alt')} />
            </Grid>

            <Grid item md={7} xs={12}>
              <Typography textAlign="left" variant="h3" fontWeight="600" mb={1}>
                {t('message')}
              </Typography>
              <Typography textAlign="left" sx={{ my: 4 }}>
                {t('body')}
              </Typography>
              <img
                style={{ display: 'block' }}
                src={signature}
                height={80}
                alt={t('signature-alt')}
              />
              <Typography textAlign="left">{t('signature')}</Typography>
              <Typography textAlign="left" sx={{ mt: 1 }}>
                {t('signature-title')}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </BannerBox>

      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ mt: 4 }}
          alignItems="center"
        >
          <Typography variant="h3" fontWeight="600" mb={1}>
            {t('get-started')}
          </Typography>
          <Typography>{t('get-started-description')}</Typography>
          <Link href="/getting-started">
            <Button variant="contained" sx={{ mt: 4 }}>
              {t('getting-started')}
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  )
}
