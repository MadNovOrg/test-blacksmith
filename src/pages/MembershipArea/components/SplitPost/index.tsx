import {
  Box,
  BoxProps,
  Chip,
  Link,
  Skeleton,
  styled,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

import { getPostLink, getTagLink } from '../../utils'
import { PostCategory } from '../PostCategory'
import { PostImage } from '../PostImage'
import { VideoThumbnail } from '../VideoThumbnail'

type ImageOrientation = 'left' | 'right'

const SplitPostBox = styled(Box)<{ orientation: ImageOrientation }>(
  ({ theme, orientation }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: orientation === 'right' ? 'row-reverse' : 'row',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  }),
)

const ThumbnailBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'fluidImageWidth',
})<{
  orientation?: ImageOrientation
  fluidImageWidth?: boolean
}>(({ theme, orientation, fluidImageWidth }) => ({
  marginRight: orientation === 'left' ? theme.spacing(3) : 0,
  marginLeft: orientation === 'right' ? theme.spacing(3) : 0,
  maxWidth: '50%',
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(3),
    marginRight: 0,
    maxWidth: '100%',
  },
  ...(!fluidImageWidth ? { flex: 1 } : null),
}))

export type Props = {
  id: string
  title: string
  description: string
  label: string
  imageUrl?: string | null
  imageSrcSet?: string | null
  tags?: Array<{ id: string; name: string }>
  category?: { id: string; name: string }
  publishedDate: string
  orientation?: ImageOrientation
  linkTo?: string
  isVideo?: boolean
  duration?: number
  afterDescription?: React.ReactElement
  fluidImageWidth?: boolean
} & BoxProps

export const SplitPost: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  title,
  label,
  imageUrl,
  imageSrcSet,
  description,
  tags,
  category,
  publishedDate,
  orientation = 'right',
  linkTo,
  isVideo = false,
  duration,
  afterDescription,
  fluidImageWidth = false,
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
        imageSrcSet={imageSrcSet ?? undefined}
      />
    ) : (
      <PostImage
        src={imageUrl ?? ''}
        alt={title}
        srcSet={imageSrcSet ?? undefined}
      />
    )

  return (
    <SplitPostBox {...rest} orientation={orientation}>
      <ThumbnailBox orientation={orientation} fluidImageWidth={fluidImageWidth}>
        {imageUrl ? (
          linkTo ? (
            <Link href={linkTo ?? getPostLink(id)}>{thumbnail}</Link>
          ) : (
            thumbnail
          )
        ) : null}
      </ThumbnailBox>
      <Box flex={1}>
        {label && (
          <Chip
            color="teal"
            sx={{
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
    </SplitPostBox>
  )
}

export const SplitPostSkeleton: React.FC<
  React.PropsWithChildren<BoxProps & { orientation?: ImageOrientation }>
> = ({ orientation = 'left', ...props }) => (
  <SplitPostBox
    {...props}
    display="flex"
    alignItems="center"
    orientation={orientation}
  >
    <ThumbnailBox flex={1} mr={3} orientation={orientation}>
      <Skeleton variant="rectangular" height={350} />
    </ThumbnailBox>
    <Box flex={1}>
      <Skeleton />
      <Skeleton sx={{ marginBottom: 2 }} />
      <Skeleton />
      <Skeleton sx={{ marginBottom: 2 }} />
      <Skeleton width="50%" />
    </Box>
  </SplitPostBox>
)
