import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { FOOTER_HEIGHT } from '@app/theme'

import { AppLogo } from '../AppLogo'

export const AppFooter = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { acl } = useAuth()

  const url = import.meta.env.VITE_BASE_WORDPRESS_API_URL

  const { origin } = useMemo(() => (url ? new URL(url) : { origin: '' }), [url])

  const links = [
    {
      href: `${origin}/policies-procedures/terms-of-use/`,
      labelKey: 'terms-of-use',
    },
    {
      href: `${origin}${
        acl.isUK()
          ? '/policies-procedures/terms-of-business/'
          : '/au/terms-conditions-au-nz/'
      }`,
      labelKey: 'terms-of-business',
    },
    {
      href: `${origin}/policies-procedures/privacy-policy/`,
      labelKey: 'privacy-policy',
    },
    {
      href: `${origin}/policies-procedures/cookie-policy/`,
      labelKey: 'cookie-policy',
    },
  ]

  return (
    <Box
      bgcolor={theme.palette.primary.main}
      sx={{ minHeight: FOOTER_HEIGHT }}
      className="app-footer"
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '192px',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center">
          <AppLogo variant="white" />
          <Box>
            <List dense sx={{ listStyleType: 'none', px: isMobile ? 2 : 4 }}>
              {links.map(({ href, labelKey }) => (
                <ListItem key={labelKey} disablePadding>
                  <ListItemText>
                    <Link
                      href={href}
                      target="_blank"
                      role="link"
                      rel="noopener noreferrer"
                      component={'a'}
                      color={theme.palette.common.white}
                      aria-label={`${t(labelKey)} (${t('opens-new-window')})`}
                      sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                      data-testid={labelKey}
                    >
                      {t(labelKey)}
                    </Link>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box display={isMobile ? 'block' : 'flex'}>
          <Typography color={theme.palette.common.white} mr={1}>
            {t('components.footer.follow')}
          </Typography>
          {acl.isAustralia() ? (
            <Link
              href="https://www.linkedin.com/company/team-teach-asia-pacific/"
              mr={1}
              target="_blank"
              component={'a'}
              aria-label={`${t('socials.linkedIn')} (${t('opens-new-window')})`}
            >
              <LinkedInIcon htmlColor={theme.palette.common.white} />
            </Link>
          ) : null}

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
