import { Box, BoxProps, Chip, Link, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import theme from '@app/theme'

import { getPostLink, getTagLink } from '../../utils'
import { PostCategory } from '../PostCategory'
import { PostImage } from '../PostImage'
import { VideoThumbnail } from '../VideoThumbnail'

export type Props = {
  id: string
  title: string
  description: string
  label: string
  imageUrl?: string | null
  tags?: Array<{ id: string; name: string }>
  category?: { id: string; name: string }
  publishedDate: string
  orientation?: 'left' | 'right'
  linkTo?: string
  isVideo?: boolean
  duration?: number
  afterDescription?: React.ReactElement
} & BoxProps

export const SplitPost: React.FC<Props> = ({
  id,
  title,
  label,
  imageUrl,
  description,
  tags,
  category,
  publishedDate,
  orientation = 'right',
  linkTo,
  isVideo = false,
  duration,
  afterDescription = noop,
  children: _children,
  ...rest
}) => {
  const { t } = useTranslation()

  const thumbnail =
    isVideo && duration ? (
      <VideoThumbnail
        duration={duration}
        imageUrl={imageUrl ?? ''}
        alt={title}
        durationPosition="center"
      />
    ) : (
      <PostImage src={imageUrl ?? ''} alt={title} />
    )

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection={orientation === 'left' ? 'row' : 'row-reverse'}
      {...rest}
    >
      <Box
        mr={orientation === 'left' ? 3 : 0}
        ml={orientation === 'right' ? 3 : 0}
        flex={1}
      >
        {imageUrl ? (
          linkTo ? (
            <Link href={linkTo ?? getPostLink(id)}>{thumbnail}</Link>
          ) : (
            thumbnail
          )
        ) : null}
      </Box>
      <Box flex={1}>
        {label && (
          <Chip
            sx={{
              background: theme.colors.teal[500],
              color: theme.palette.common.white,
              marginBottom: 3,
              fontWeight: 600,
            }}
            label={label}
          />
        )}
        {category && <PostCategory category={category} />}

        <Typography
          variant="h5"
          sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
          mb={2}
        >
          {linkTo ? (
            <Link href={linkTo ?? getPostLink(id)}>{title}</Link>
          ) : (
            title
          )}
        </Typography>
        <Typography mb={2} variant="body2">
          {description}
        </Typography>
        <Box display="flex">
          {tags?.map(tag => (
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
        {afterDescription}
      </Box>
    </Box>
  )
}

export const SplitPostSkeleton: React.FC<BoxProps> = ({ ...props }) => (
  <Box {...props} display="flex" alignItems="center">
    <Box flex={1} mr={3}>
      <Skeleton variant="rectangular" height={350} />
    </Box>
    <Box flex={1}>
      <Skeleton />
      <Skeleton sx={{ marginBottom: 2 }} />
      <Skeleton />
      <Skeleton sx={{ marginBottom: 2 }} />
      <Skeleton width="50%" />
    </Box>
  </Box>
)
