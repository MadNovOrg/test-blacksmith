import {
  Box,
  Container,
  Typography,
  Link,
  Skeleton,
  Grid,
  styled,
  Alert,
} from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { VideoItemQuery, VideoItemQueryVariables } from '@app/generated/graphql'
import VIDEO_ITEM_QUERY from '@app/queries/membership/video-item'
import theme from '@app/theme'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ContentDetailsBox } from '../../components/ContentDetailsBox'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'

const YTContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%',

  '& .video': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

export const VideoItem: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const [{ data, fetching, error }] = useQuery<
    VideoItemQuery,
    VideoItemQueryVariables
  >({
    query: VIDEO_ITEM_QUERY,
    variables: {
      id,
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const videoId = useMemo(() => {
    if (data?.content?.videoSeriesItem?.youtube?.url) {
      const parts = data.content.videoSeriesItem.youtube.url.split('/')

      return parts[parts.length - 1]
    }

    return null
  }, [data])

  const hasError = (!fetching && !data?.content?.videoSeriesItem) || error

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5, paddingTop: 8 }}>
      <Box mb={6}>
        <ContentDetailsBox width="50%" mb={2}>
          <Typography variant="body2" fontWeight={600} mb={3}>
            {fetching ? (
              <Skeleton
                width={100}
                data-testid="back-nav-skeleton"
                component="span"
              />
            ) : (
              <Link href="../">{t('pages.membership.video-series.title')}</Link>
            )}
          </Typography>

          <Typography
            variant="h1"
            color="primary"
            mb={3}
            data-testid="video-item-title"
          >
            {fetching ? (
              <Box data-testid="title-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.content?.videoSeriesItem ? (
              data.content.videoSeriesItem.title
            ) : null}
          </Typography>
          <Typography
            mb={2}
            lineHeight={2}
            color={theme.palette.text.secondary}
            data-testid="video-item-description"
          >
            {fetching ? (
              <Box data-testid="description-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.content?.videoSeriesItem?.excerpt ? (
              sanitize(data.content.videoSeriesItem.excerpt, {
                allowedTags: [],
              })
            ) : null}
          </Typography>
          <Typography variant="body2">
            {fetching ? (
              <Skeleton width={100} />
            ) : data?.content?.videoSeriesItem?.date ? (
              t('dates.default', {
                date: new Date(data.content.videoSeriesItem.date),
              })
            ) : null}
          </Typography>
        </ContentDetailsBox>

        {hasError ? (
          <Alert severity="error">
            {t('pages.membership.video-series.not-found')}
          </Alert>
        ) : null}

        {videoId && !fetching ? (
          <YTContainer>
            <YouTube
              videoId={videoId}
              id={`yt-embed-${data?.content?.videoSeriesItem?.id}`}
              iframeClassName="video"
              opts={{ playerVars: { rel: 0 } }}
            />
          </YTContainer>
        ) : null}
      </Box>

      {data?.content?.recentVideoItems?.nodes?.length &&
      !fetching &&
      !hasError ? (
        <Box data-testid="recent-video-items">
          <Typography mb={3} variant="h3" color="primary">
            {t('pages.membership.video-series.recent')}
          </Typography>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="video-series-grid"
          >
            {data.content.recentVideoItems.nodes.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <Grid
                  item
                  key={item.id}
                  lg={3}
                  md={6}
                  sm={12}
                  data-grid-item={index}
                >
                  <BlogPostItem
                    id={item.id}
                    imageUrl={item.featuredImage?.node?.mediaItemUrl}
                    imageSrcSet={item.featuredImage?.node?.srcSet}
                    title={item.title ?? ''}
                    publishedDate={item.date ?? ''}
                    description={sanitize(item.excerpt ?? '', {
                      allowedTags: [],
                    })}
                    linkTo={`../${item.id}`}
                    data-testid={`video-series-grid-item-${item.id}`}
                    isVideo
                    duration={item.youtube?.duration ?? undefined}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      ) : fetching ? (
        <>
          <Typography variant="h3" mb={3}>
            <Skeleton width={200} component="span" />
          </Typography>

          <ItemsGridSkeleton data-testid="related-video-items-skeleton" />
        </>
      ) : null}
    </Container>
  )
}
