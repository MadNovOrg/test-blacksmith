import { Box, BoxProps, Link, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

import { getPostLink } from '../../utils'
import { PostCategory } from '../PostCategory'
import { PostImage } from '../PostImage'
import { TagChip } from '../TagChip'
import { VideoThumbnail } from '../VideoThumbnail'

export type Props = {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  imageSrcSet?: string | null
  tags?: Array<{ id: string; name: string }>
  category?: { id: string; name: string }
  publishedDate: string
  isVideo?: boolean
  duration?: number
  linkTo?: string
  afterDescription?: React.ReactElement
} & BoxProps

export const BlogPostItem: React.FC<Props> = ({
  imageUrl,
  imageSrcSet,
  title,
  id,
  description,
  tags = [],
  isVideo = false,
  category,
  publishedDate,
  duration,
  linkTo,
  afterDescription,
  ...rest
}) => {
  const { t } = useTranslation()
  const thumbnail = (
    <Box textAlign="center">
      {isVideo && duration ? (
        <VideoThumbnail
          duration={duration}
          imageUrl={imageUrl ?? ''}
          imageSrcSet={imageSrcSet ?? undefined}
          alt={title}
        />
      ) : (
        <PostImage
          src={imageUrl ?? ''}
          srcSet={imageSrcSet ?? undefined}
          alt={title}
        />
      )}
    </Box>
  )

  return (
    <Box {...rest}>
      {imageUrl ? (
        linkTo ? (
          <Link
            href={linkTo ?? getPostLink(id)}
            sx={{ marginBottom: 1, display: 'block' }}
          >
            {thumbnail}
          </Link>
        ) : (
          thumbnail
        )
      ) : null}

      {category && <PostCategory category={category} />}

      <Typography
        variant="h5"
        sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
        mb={2}
      >
        {linkTo ? <Link href={linkTo ?? getPostLink(id)}>{title}</Link> : title}
      </Typography>

      <Typography mb={2} variant="body2">
        {description}
      </Typography>

      <Box display="flex" flexWrap="wrap">
        {tags.map(tag => (
          <TagChip
            key={tag.id}
            tag={tag}
            sx={{ marginRight: 1, marginBottom: 1 }}
          />
        ))}
        <Typography variant="body2">
          {t('dates.default', { date: new Date(publishedDate) })}
        </Typography>
      </Box>
      {afterDescription}
    </Box>
  )
}

export const BlogPostItemSkeleton: React.FC = () => (
  <>
    <Skeleton variant="rectangular" height={170} sx={{ marginBottom: 2 }} />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton sx={{ marginBottom: 2 }} />
    <Skeleton width="50%" />
  </>
)
