import { Box, Chip, Link, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

import { getPostLink, getTagLink } from '../../utils'
import { PostCategory } from '../PostCategory'
import { PostImage } from '../PostImage'
import { VideoThumbnail } from '../VideoThumbnail'

export type Props = {
  id: string
  title: string
  description: string
  imageUrl: string
  tags?: Array<{ id: string; name: string }>
  category: { id: string; name: string }
  publishedDate: string
  isVideo?: boolean
  duration?: number
}

export const BlogPostItem: React.FC<Props> = ({
  imageUrl,
  title,
  id,
  description,
  tags = [],
  isVideo = false,
  category,
  publishedDate,
  duration,
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Link href={getPostLink(id)} sx={{ marginBottom: 1, display: 'block' }}>
        {isVideo && duration ? (
          <VideoThumbnail duration={duration} imageUrl={imageUrl} alt={title} />
        ) : (
          <PostImage src={imageUrl} alt={title} />
        )}
      </Link>

      <PostCategory category={category} />

      <Typography
        variant="h5"
        sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
        mb={2}
      >
        <Link href={getPostLink(id)}>{title}</Link>
      </Typography>

      <Typography mb={2} variant="body2">
        {description}
      </Typography>

      <Box display="flex">
        {tags.map(tag => (
          <Chip
            key={tag.id}
            label={<Link href={getTagLink(tag.id)}>{tag.name}</Link>}
            sx={{ marginRight: 1 }}
            size="small"
          />
        ))}
        <Typography variant="body2">
          {t('dates.default', { date: new Date(publishedDate) })}
        </Typography>
      </Box>
    </Box>
  )
}
