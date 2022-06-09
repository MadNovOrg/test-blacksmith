import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { PodcastQuery, PodcastQueryVariables } from '@app/generated/graphql'
import QUERY from '@app/queries/membership/podcast'
import theme from '@app/theme'

import { BlogPostItem } from '../../components/BlogPostItem'
import { PodcastPlayer } from '../../components/PodcastPlayer'

export const Podcast: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const [{ data, fetching, error }] = useQuery<
    PodcastQuery,
    PodcastQueryVariables
  >({
    query: QUERY,
    variables: { id },
  })

  const podcastNotFound = !data?.podcast?.podcast && !fetching && !error

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5, paddingTop: 8 }}>
      {fetching ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : null}

      {error ? (
        <Alert severity="error">
          {t('pages.membership.podcasts.error-loading-podcast')}
        </Alert>
      ) : null}

      {podcastNotFound ? (
        <Alert severity="error">
          {t('pages.membership.podcasts.not-found')}
        </Alert>
      ) : null}

      {data?.podcast?.podcast && !fetching ? (
        <Box mb={6}>
          <Box width="50%" mb={2}>
            <Typography variant="body2" fontWeight={600} mb={3}>
              <Link href="../">{t('pages.membership.podcasts.title')}</Link>
            </Typography>
            <Typography
              variant="h1"
              color="primary"
              mb={3}
              data-testid="podcast-title"
            >
              {data.podcast.podcast.name}
            </Typography>
            <Typography
              mb={2}
              lineHeight={2}
              color={theme.palette.text.secondary}
            >
              {data.podcast.podcast.description}
            </Typography>
            <Typography variant="body2" mb={2}>
              {t('pages.membership.common.author', {
                author: data.podcast.podcast.author,
              })}
            </Typography>
            <Typography variant="body2">
              {t('dates.default', {
                date: new Date(data.podcast.podcast.publishedDate),
              })}
            </Typography>
          </Box>

          <PodcastPlayer
            author={data.podcast.podcast.author}
            mediaUrl={data.podcast.podcast.mediaUrl}
            thumbnailUrl={data.podcast.podcast.thumbnail ?? ''}
            title={t('pages.membership.podcasts.episode-number', {
              number: data.podcast.podcast.episodeNumber,
            })}
          />
        </Box>
      ) : null}

      {data?.podcast?.podcast &&
      data?.recentPodcasts?.records.length &&
      !fetching ? (
        <Box data-testid="recent-podcasts">
          <Typography mb={3} variant="h3" color="primary">
            {t('pages.membership.podcasts.recent')}
          </Typography>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {data.recentPodcasts.records.map((podcast, index) => (
              <Grid item key={podcast.id} xs={3} data-grid-item={index}>
                <BlogPostItem
                  id={podcast.id}
                  imageUrl={podcast.thumbnail}
                  title={podcast.name}
                  publishedDate={podcast.publishedDate}
                  description={
                    `${podcast.description?.substring(0, 120)}...` ?? ''
                  }
                  linkTo={`../${podcast.id}`}
                  data-testid={`podcast-grid-item-${podcast.id}`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}
    </Container>
  )
}
