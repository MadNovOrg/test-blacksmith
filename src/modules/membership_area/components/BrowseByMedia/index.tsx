import { Home } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  BlogIcon,
  EbookIcon,
  PodcastsIcon,
  ResearchSummaryIcon,
  VideoSeriesIcon,
  WebinarIcon,
} from '@app/assets'
import theme from '@app/theme'

const iconStyles = {
  marginRight: theme.spacing(2),
  verticalAlign: 'middle',
} as const

const MediaType: React.FC<
  React.PropsWithChildren<{
    icon: (styles: typeof iconStyles) => React.ReactNode
    label: string
    linkTo: string
  }>
> = ({ icon, label, linkTo }) => {
  return (
    <Typography mr={4} mb={3} sx={{ verticalAlign: 'middle' }}>
      <Link href={linkTo}>
        {icon(iconStyles)}
        {label}
      </Link>
    </Typography>
  )
}

export const BrowseByMedia: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  return (
    <Box pl={2} pr={2}>
      <Typography variant="h1" color="primary" textAlign="center" mb={3}>
        {t('pages.membership.components.browse-by-media.title')}
      </Typography>

      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <MediaType
          label={t('common.home')}
          linkTo="/membership/"
          icon={styles => <Home style={styles} color="primary" />}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.podcasts')}
          linkTo="/membership/podcasts"
          icon={styles => <PodcastsIcon style={styles} />}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.blogs')}
          linkTo="/membership/blog"
          icon={styles => <BlogIcon style={styles} />}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.video-series')}
          linkTo="/membership/video-series"
          icon={styles => <VideoSeriesIcon style={styles} />}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.webinars')}
          linkTo="/membership/webinars"
          icon={styles => <WebinarIcon style={styles} />}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.ebooks')}
          linkTo="/membership/ebooks"
          icon={styles => <EbookIcon style={styles} />}
        />
        <MediaType
          label={t(
            'pages.membership.components.browse-by-media.research-summaries',
          )}
          linkTo="/membership/research-summaries"
          icon={styles => <ResearchSummaryIcon style={styles} />}
        />
      </Box>
    </Box>
  )
}
