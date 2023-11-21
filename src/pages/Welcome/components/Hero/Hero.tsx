import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import theme from '@app/theme'

import { RegisterCertificatePanel } from '../RegisterCertificatePanel/RegisterCertificatePanel'

import heroImage from './assets/hero-bg.png'

export const Hero = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'welcome-v2.hero' })

  const { activeCertificates } = useAuth()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const isCertified = Number(activeCertificates?.length) > 0

  return (
    <>
      <Box
        py={6}
        px={3}
        sx={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          height: {
            md: 396,
          },
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            transform: { lg: `translateY(${isCertified ? '0' : '-30%'})` },
          }}
        >
          <Typography
            variant="h1"
            color="white"
            mb={1}
            fontWeight={500}
            fontFamily="Poppins"
            textAlign="center"
          >
            {t('title')}
          </Typography>
          <Typography color="rgba(255, 255, 255, 0.5)" textAlign="center">
            {t('subtitle')}
          </Typography>
          <Stack direction="row" spacing={2} mt={4}>
            <Button
              size={isMobile ? 'medium' : 'large'}
              href={isCertified ? '/courses' : '/profile/edit'}
              LinkComponent={LinkBehavior}
              color="lime"
              variant="contained"
            >
              {isCertified
                ? t('view-courses-label')
                : t('register-certificate-label')}
            </Button>
            <Button
              href="/profile"
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              LinkComponent={LinkBehavior}
              sx={{
                boxShadow: 0,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                ':hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              {t('view-profile-label')}
            </Button>
          </Stack>
        </Box>
      </Box>

      {!isCertified ? (
        <Container
          sx={{
            transform: { lg: 'translateY(-74px)' },
            mt: { xs: 5, lg: 0 },
            width: {
              lg: 983,
            },
          }}
        >
          <RegisterCertificatePanel />
        </Container>
      ) : null}
    </>
  )
}
