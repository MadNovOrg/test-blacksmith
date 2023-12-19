import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import theme from '@app/theme'

import bgImage from './assets/register-card2.jpg'

export const RegisterCertificatePanel = () => {
  const { t } = useTranslation('pages', {
    keyPrefix: 'welcome.register-certificate-panel',
  })

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      bgcolor="white"
      borderRadius={3}
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundImage: { md: `url(${bgImage})` },
        backgroundPosition: 'bottom right',
        backgroundSize: 'cover',
      }}
    >
      <Box sx={{ width: { md: '50%' } }}>
        <Box
          p={3}
          pb={'22px'}
          position="relative"
          sx={{
            ':after': {
              content: "''",
              height: '1px',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              background:
                'linear-gradient(270deg, rgba(0, 0, 0, 0.00) 1.36%, rgba(0, 0, 0, 0.10) 100%)',
            },
          }}
        >
          <Typography
            fontFamily="Poppins"
            color="primary"
            fontWeight={500}
            variant="h3"
          >
            {t('title')}
          </Typography>
        </Box>

        <Box p={3} pb={4}>
          <Typography lineHeight={1.75} mb={3}>
            {t('description')}
          </Typography>
          <Typography fontWeight="600">
            {t('description-line-two-title')}
          </Typography>
          <Typography mb={4}>{t('description-line-two')}</Typography>

          <Button
            href="/profile/edit"
            LinkComponent={LinkBehavior}
            variant="contained"
            size={isMobile ? 'medium' : 'large'}
          >
            {t('button-label')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
