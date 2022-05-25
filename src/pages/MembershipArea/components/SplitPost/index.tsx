import { Box, BoxProps, Chip, Link, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

import { getPostLink, getTagLink } from '../../utils'
import { PostCategory } from '../PostCategory'
import { PostImage } from '../PostImage'

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
  ...rest
}) => {
  const { t } = useTranslation()

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
          <Link href={linkTo ?? getPostLink(id)}>
            <PostImage src={imageUrl} alt={title} />
          </Link>
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
          <Link href={linkTo ?? getPostLink(id)}>{title}</Link>
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
      </Box>
    </Box>
  )
}
