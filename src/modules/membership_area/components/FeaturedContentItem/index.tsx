import { Box, BoxProps, Chip, Link, styled, Typography } from '@mui/material'
import React from 'react'
import sanitize from 'sanitize-html'

import { PostImage } from '@app/modules/membership_area/components/PostImage'
import { VideoThumbnail } from '@app/modules/membership_area/components/VideoThumbnail'
import theme from '@app/theme'

const ContentBox = styled(Box)(({ theme }) => ({
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

export type Props = {
  data: {
    id: string
    title?: string | null
    excerpt?: string | null
    imageUrl?: string | null
    imageSrcSet?: string | null
    youtube?: {
      url?: string | null
      duration?: number | null
    } | null
  }
  linkTo: string
  chipLabel?: string
} & BoxProps

export const FeaturedContentItem: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  linkTo,
  chipLabel,
  ...props
}) => {
  if (!data) {
    return null
  }

  return (
    <Box {...props}>
      <ContentBox width="50%" mb={3}>
        {chipLabel ? (
          <Chip
            color="teal"
            sx={{
              background: theme.colors.teal[500],
              color: theme.palette.common.white,
              marginBottom: 3,
              fontWeight: 600,
            }}
            label={chipLabel}
          />
        ) : null}
        <Typography variant="h3" color="primary" mb={3}>
          <Link href={linkTo}>{data.title}</Link>
        </Typography>
        <Typography variant="body2">
          {sanitize(data.excerpt ?? '', { allowedTags: [] })}
        </Typography>
      </ContentBox>
      <Link href={linkTo}>
        <VideoThumbnail
          imageUrl={data.imageUrl ?? ''}
          imageSrcSet={data.imageSrcSet ?? ''}
          alt={data.title ?? ''}
          duration={data.youtube?.duration ?? 0}
          durationPosition="center"
          image={
            <PostImage
              src={data.imageUrl ?? ''}
              srcSet={data.imageSrcSet ?? ''}
              alt={data.title ?? ''}
              style={{ borderRadius: 0 }}
            />
          }
        />
      </Link>
    </Box>
  )
}
