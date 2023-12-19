import AccessTimeIcon from '@mui/icons-material/AccessTime'
import {
  Avatar,
  AvatarGroup,
  Box,
  Link,
  Skeleton,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  KnowledgeHubResourceDetailsFragment,
  KnowledgeHubResourceType,
} from '@app/generated/graphql'
import theme from '@app/theme'

import { ReactComponent as BookIcon } from './assets/book-icon.svg'
import { ReactComponent as DownloadIcon } from './assets/download-icon.svg'
import { ReactComponent as PodcastIcon } from './assets/podcast-icon.svg'
import { ReactComponent as VideoIcon } from './assets/video-icon.svg'

const chipOptions: Record<
  KnowledgeHubResourceType,
  {
    color: string | undefined
    textColor: string | undefined
    icon: React.ReactElement
  }
> = {
  [KnowledgeHubResourceType.Video]: {
    color: theme.palette.error.light,
    textColor: theme.palette.error.main,
    icon: <VideoIcon />,
  },
  [KnowledgeHubResourceType.Article]: {
    color: theme.colors.lime[100],
    textColor: theme.colors.lime[600],
    icon: <BookIcon />,
  },
  [KnowledgeHubResourceType.Podcast]: {
    color: '#E4F1F3',
    textColor: theme.palette.info.main,
    icon: <PodcastIcon />,
  },
  [KnowledgeHubResourceType.Download]: {
    color: theme.palette.warning.light,
    textColor: theme.palette.warning.main,
    icon: <DownloadIcon />,
  },
}

export const ResourceCard: React.FC<{
  resource: KnowledgeHubResourceDetailsFragment
}> = ({ resource }) => {
  const { t } = useTranslation()

  return (
    <Box
      borderRadius={3}
      bgcolor="white"
      boxShadow={1}
      overflow="hidden"
      height="100%"
      component={Link}
      underline="none"
      href={resource.url}
      display="block"
      sx={{
        '& .resource-card-image': {
          transition: 'transform 0.4s',
          verticalAlign: 'middle',
        },
        ':hover': { '& .resource-card-image': { transform: 'scale(1.1)' } },
      }}
    >
      <Box position="relative">
        <Box sx={{ overflow: 'hidden' }}>
          <img
            style={{ maxWidth: '100%', objectFit: 'cover' }}
            src={resource.imageUrl}
            alt={resource.title}
            className="resource-card-image"
            srcSet={resource.srcSet ?? undefined}
          />
        </Box>

        {resource.authors?.length ? (
          <Box
            position="absolute"
            sx={{ transform: 'translateY(-35px)', right: 2 }}
            pr={2}
          >
            <AvatarGroup>
              {resource.authors.map(author => (
                <Avatar
                  key={author}
                  src={author}
                  sx={{ width: 50, height: 50, boxShadow: 1 }}
                />
              ))}
            </AvatarGroup>
          </Box>
        ) : null}
      </Box>

      <Box p={3} pb={0}>
        <Typography variant="h4" fontFamily="Poppins" color="primary" mb={1.5}>
          {resource.title}
        </Typography>

        <Box sx={{ display: { lg: 'flex' } }} justifyContent="space-between">
          <Typography
            display="flex"
            alignItems="center"
            color="grey.600"
            fontSize={14}
          >
            <AccessTimeIcon sx={{ mr: 0.5 }} fontSize="small" />
            {t('dates.default', {
              date: new Date(resource.publishedDate),
            })}
          </Typography>

          <Box
            bgcolor={chipOptions[resource.type].color}
            borderRadius={4}
            py={0.5}
            px={1}
            display="inline-block"
            sx={{ mt: { lg: 0, md: 1 } }}
          >
            <Typography
              fontSize={12}
              color={chipOptions[resource.type].textColor}
            >
              <Box component="span" mr={0.5}>
                {chipOptions[resource.type].icon}
              </Box>

              {t(`pages.welcome.resource-card.type-${resource.type}`)}
            </Typography>
          </Box>
        </Box>

        <Typography
          color="grey.600"
          dangerouslySetInnerHTML={{ __html: resource.description }}
        />
      </Box>
    </Box>
  )
}

export const ResourceCardSkeleton: React.FC = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
    </Box>
  )
}
