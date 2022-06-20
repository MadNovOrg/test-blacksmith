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

const MediaType: React.FC<{
  icon: React.ElementType
  label: string
  linkTo: string
}> = ({ icon, label, linkTo }) => {
  const Icon = icon

  return (
    <Typography mr={4} mb={3} sx={{ verticalAlign: 'middle' }}>
      <Link href={linkTo}>
        <Icon
          style={{ marginRight: theme.spacing(2), verticalAlign: 'middle' }}
        />
        {label}
      </Link>
    </Typography>
  )
}

export const BrowseByMedia: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box pl={2} pr={2}>
      <Typography variant="h1" color="primary" textAlign="center" mb={3}>
        {t('pages.membership.components.browse-by-media.title')}
      </Typography>

      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <MediaType
          label={t('pages.membership.components.browse-by-media.podcasts')}
          linkTo="/membership/podcasts"
          icon={PodcastsIcon}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.blogs')}
          linkTo="/membership/blog"
          icon={BlogIcon}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.video-series')}
          linkTo="/membership/video-series"
          icon={VideoSeriesIcon}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.webinars')}
          linkTo="/membership/webinars"
          icon={WebinarIcon}
        />

        <MediaType
          label={t('pages.membership.components.browse-by-media.ebooks')}
          linkTo="/membership/ebooks"
          icon={EbookIcon}
        />
        <MediaType
          label={t(
            'pages.membership.components.browse-by-media.research-summaries'
          )}
          linkTo="/membership/research-summaries"
          icon={ResearchSummaryIcon}
        />
      </Box>
    </Box>
  )
}
