import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Container, Link, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme, { FOOTER_HEIGHT } from '@app/theme'

import { Logo } from '../Logo'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <Box bgcolor={theme.palette.primary.main} sx={{ minHeight: FOOTER_HEIGHT }}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '96px',
          justifyContent: 'space-between',
        }}
      >
        <Logo variant="white" />
        <Box display="flex">
          <Typography color={theme.palette.common.white} mr={1}>
            {t('components.footer.follow')}
          </Typography>
          <Link
            href="https://www.facebook.com/Team-Teach-Ltd-109897753752813/"
            mr={1}
            target="_blank"
            component={'a'}
            aria-label={`${t('socials.facebook')} (${t('opens-new-window')})`}
          >
            <FacebookIcon htmlColor={theme.palette.common.white} />
          </Link>
          <Link
            href="https://www.instagram.com/teamteachuk/"
            mr={1}
            target="_blank"
            component={'a'}
            aria-label={`${t('socials.instagram')} (${t('opens-new-window')})`}
          >
            <InstagramIcon htmlColor={theme.palette.common.white} />
          </Link>
          <Link
            href="https://twitter.com/TeamTeachLtd"
            target="_blank"
            mr={1}
            component={'a'}
            aria-label={`${t('socials.twitter')} (${t('opens-new-window')})`}
          >
            <TwitterIcon htmlColor={theme.palette.common.white} />
          </Link>
          <Link
            href="https://www.youtube.com/channel/UCpMhNpsL3ICI_K9H8OnfI6Q"
            target="_blank"
            component={'a'}
            aria-label={`${t('socials.youtube')} (${t('opens-new-window')})`}
          >
            <YouTubeIcon htmlColor={theme.palette.common.white} />
          </Link>
        </Box>
      </Container>
    </Box>
  )
}
