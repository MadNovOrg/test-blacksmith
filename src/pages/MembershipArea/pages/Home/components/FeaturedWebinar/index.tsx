import { Box, Chip, Link, styled, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'

import { WebinarSummaryFragment } from '@app/generated/graphql'
import { PostImage } from '@app/pages/MembershipArea/components/PostImage'
import { VideoThumbnail } from '@app/pages/MembershipArea/components/VideoThumbnail'
import theme from '@app/theme'

const ContentBox = styled(Box)(({ theme }) => ({
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

export const FeaturedWebinar: React.FC<{
  webinar: WebinarSummaryFragment | null
}> = ({ webinar }) => {
  const { t } = useTranslation()

  if (!webinar) {
    return null
  }

  return (
    <Box data-testid="featured-webinar" mb={5}>
      <ContentBox width="50%" mb={3}>
        <Chip
          sx={{
            background: theme.colors.teal[500],
            color: theme.palette.common.white,
            marginBottom: 3,
            fontWeight: 600,
          }}
          label={t('pages.membership.webinars.featured-label')}
        />
        <Typography variant="h3" color="primary" mb={3}>
          <Link href={`./webinars/${webinar.id}`}>{webinar.title}</Link>
        </Typography>
        <Typography variant="body2">
          {sanitize(webinar.excerpt ?? '', { allowedTags: [] })}
        </Typography>
      </ContentBox>
      <Link href={`./webinars/${webinar.id}`}>
        <VideoThumbnail
          imageUrl={webinar.featuredImage?.node?.mediaItemUrl ?? ''}
          imageSrcSet={webinar.featuredImage?.node?.srcSet ?? ''}
          alt={webinar.title ?? ''}
          duration={webinar.youtube?.duration ?? 0}
          durationPosition="center"
          image={
            <PostImage
              src={webinar.featuredImage?.node?.mediaItemUrl ?? ''}
              srcSet={webinar.featuredImage?.node?.srcSet ?? ''}
              alt={webinar.title ?? ''}
              style={{ borderRadius: 0 }}
            />
          }
        />
      </Link>
    </Box>
  )
}
