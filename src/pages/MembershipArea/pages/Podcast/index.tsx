import {
  Alert,
  Box,
  Container,
  Grid,
  Link,
  Skeleton,
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
import { ContentDetailsBox } from '../../components/ContentDetailsBox'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { PodcastPlayer } from '../../components/PodcastPlayer'

const Podcast: React.FC = () => {
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

      <Box mb={6}>
        <ContentDetailsBox mb={2}>
          <Typography variant="body2" fontWeight={600} mb={3}>
            {fetching ? (
              <Skeleton
                width={100}
                data-testid="back-nav-skeleton"
                component="span"
              />
            ) : (
              <Link href="../">{t('pages.membership.podcasts.title')}</Link>
            )}
          </Typography>
          <Typography
            variant="h1"
            color="primary"
            mb={3}
            data-testid="podcast-title"
          >
            {fetching ? (
              <Box data-testid="title-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.podcast?.podcast?.name ? (
              data?.podcast?.podcast?.name
            ) : null}
          </Typography>
          <Typography
            mb={2}
            lineHeight={2}
            color={theme.palette.text.secondary}
          >
            {fetching ? (
              <Box data-testid="description-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.podcast?.podcast?.description ? (
              data.podcast.podcast.description
            ) : null}
          </Typography>
          <Typography variant="body2" mb={2}>
            {fetching ? (
              <Skeleton component="span" width={100} />
            ) : data?.podcast?.podcast?.author ? (
              t('pages.membership.common.author', {
                author: data.podcast.podcast.author,
              })
            ) : null}
          </Typography>
          <Typography variant="body2">
            {fetching ? (
              <Skeleton component="span" width={100} />
            ) : data?.podcast?.podcast?.publishedDate ? (
              t('dates.default', {
                date: new Date(data.podcast.podcast.publishedDate),
              })
            ) : null}
          </Typography>
        </ContentDetailsBox>

        {fetching ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            data-testid="podcast-player-skeleton"
          >
            <div style={{ paddingTop: 120 }} />
          </Skeleton>
        ) : data?.podcast?.podcast ? (
          <PodcastPlayer
            author={data.podcast.podcast.author}
            mediaUrl={data.podcast.podcast.mediaUrl}
            thumbnailUrl={data.podcast.podcast.thumbnail ?? ''}
            title={t('pages.membership.podcasts.episode-number', {
              number: data.podcast.podcast.episodeNumber,
            })}
          />
        ) : null}
      </Box>

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
              <Grid
                item
                key={podcast.id}
                lg={3}
                md={6}
                sm={12}
                data-grid-item={index}
              >
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
      ) : (
        <>
          <Typography variant="h3" mb={3}>
            <Skeleton width={200} component="span" />
          </Typography>

          <ItemsGridSkeleton data-testid="recent-podcasts-skeleton" />
        </>
      )}
    </Container>
  )
}

export default Podcast
