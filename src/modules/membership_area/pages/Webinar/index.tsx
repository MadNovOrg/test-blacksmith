import {
  Box,
  Container,
  Typography,
  Link,
  Skeleton,
  Grid,
  Alert,
} from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { WebinarQuery, WebinarQueryVariables } from '@app/generated/graphql'
import WEBINAR_QUERY from '@app/queries/membership/webinar'
import theme from '@app/theme'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ContentDetailsBox } from '../../components/ContentDetailsBox'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { YTContainer } from '../../components/YTContainer'

const Webinar: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const [{ data, fetching, error }] = useQuery<
    WebinarQuery,
    WebinarQueryVariables
  >({
    query: WEBINAR_QUERY,
    variables: {
      id,
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const videoId = useMemo(() => {
    if (data?.content?.webinar?.youtube?.url) {
      const parts = data.content.webinar.youtube.url.split('/')

      return parts[parts.length - 1]
    }

    return null
  }, [data])

  const hasError = (!fetching && !data?.content?.webinar) || error

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
              <Link href="../">{t('pages.membership.webinars.title')}</Link>
            )}
          </Typography>

          <Typography
            variant="h1"
            color="primary"
            mb={3}
            data-testid="webinar-title"
          >
            {fetching ? (
              <Box data-testid="title-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.content?.webinar ? (
              data.content.webinar.title
            ) : null}
          </Typography>
          <Typography
            mb={2}
            lineHeight={2}
            color={theme.palette.text.secondary}
            data-testid="webinar-description"
          >
            {fetching ? (
              <Box data-testid="description-skeleton" component="span">
                <Skeleton component="span" />
                <Skeleton component="span" />
                <Skeleton component="span" />
              </Box>
            ) : data?.content?.webinar?.excerpt ? (
              sanitize(data.content.webinar.excerpt, {
                allowedTags: [],
              })
            ) : null}
          </Typography>
          <Typography variant="body2">
            {fetching ? (
              <Skeleton width={100} />
            ) : data?.content?.webinar?.date ? (
              t('dates.default', {
                date: new Date(data.content.webinar.date),
              })
            ) : null}
          </Typography>
        </ContentDetailsBox>

        {hasError ? (
          <Alert severity="error">
            {t('pages.membership.webinars.not-found')}
          </Alert>
        ) : null}

        {videoId && !fetching ? (
          <YTContainer>
            <YouTube
              videoId={videoId}
              id={`yt-embed-${data?.content?.webinar?.id}`}
              iframeClassName="video"
              opts={{ playerVars: { rel: 0 } }}
            />
          </YTContainer>
        ) : null}
      </Box>

      {data?.content?.recentWebinars?.nodes?.length &&
      !fetching &&
      !hasError ? (
        <Box data-testid="recent-webinars">
          <Typography mb={3} variant="h3" color="primary">
            {t('pages.membership.webinars.recent')}
          </Typography>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="webinars-grid"
          >
            {data.content.recentWebinars.nodes.map((item, index) => {
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
                    data-testid={`webinars-grid-item-${item.id}`}
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

          <ItemsGridSkeleton data-testid="recent-webinars-skeleton" />
        </>
      ) : null}
    </Container>
  )
}

export default Webinar
