import { Alert, Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import {
  BlogIcon,
  EbookIcon,
  PodcastsIcon,
  ResearchSummaryIcon,
  VideoSeriesIcon,
  WebinarIcon,
} from '@app/assets'
import { MembershipHomeQuery } from '@app/generated/graphql'
import HOME_QUERY from '@app/queries/membership/home'

import { BlogPostItem } from '../../components/BlogPostItem'
import { DownloadButton } from '../../components/DownloadButton'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

import { GridTitle, ContentGrid, ContentGridItem } from './components/layout'

export const Home: React.FC = () => {
  const { t } = useTranslation()

  const [{ data, fetching, error }] = useQuery<MembershipHomeQuery>({
    query: HOME_QUERY,
  })

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <Typography variant="h1" color="primary" textAlign="center" padding={6}>
        {t('pages.membership.home.title')}
      </Typography>

      {error ? (
        <Alert severity="error">{t('pages.membership.home.error')}</Alert>
      ) : null}

      {fetching ? (
        <>
          <SplitPostSkeleton sx={{ marginBottom: 3 }} />
          <ItemsGridSkeleton />
        </>
      ) : null}

      {!fetching && data ? (
        <>
          {data.content?.posts?.nodes?.length ? (
            <Box mb={4}>
              <SplitPost
                id={data.content.posts.nodes[0]?.id ?? ''}
                title={data.content.posts.nodes[0]?.title ?? ''}
                imageUrl={
                  data.content.posts.nodes[0]?.featuredImage?.node?.mediaItemUrl
                }
                imageSrcSet={
                  data.content.posts.nodes[0]?.featuredImage?.node?.srcSet
                }
                publishedDate={data.content.posts.nodes[0]?.date ?? ''}
                label={t('pages.membership.home.recommended-label')}
                description={sanitize(
                  data.content.posts.nodes[0]?.excerpt ?? '',
                  {
                    allowedTags: [],
                  }
                )}
                orientation="left"
                linkTo={`./blog/${data.content.posts.nodes[0]?.id}`}
                data-testid="featured-post-item"
                tags={data.content.posts.nodes[0]?.tags?.nodes?.map(tag => ({
                  id: tag?.id ?? '',
                  name: tag?.name ?? '',
                }))}
              />
            </Box>
          ) : null}
          {data.podcasts?.records.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<PodcastsIcon />}
                linkTo="./podcasts"
                data-testid="podcasts-grid-title"
              >
                {t('pages.membership.podcasts.title')}
              </GridTitle>
              <ContentGrid data-testid="podcasts-grid">
                {data.podcasts.records.map((podcast, index) => (
                  <ContentGridItem key={podcast.id} data-grid-item={index}>
                    <BlogPostItem
                      id={podcast.id}
                      imageUrl={podcast.thumbnail}
                      title={podcast.name}
                      publishedDate={podcast.publishedDate}
                      description={
                        `${podcast.description?.substring(0, 120)}...` ?? ''
                      }
                      linkTo={`./podcasts/${podcast.id}`}
                      data-testid={`podcast-grid-item-${podcast.id}`}
                    />
                  </ContentGridItem>
                ))}
              </ContentGrid>
            </Box>
          ) : null}
          {data.content?.posts?.nodes?.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<BlogIcon />}
                linkTo="./blog"
                data-testid="blog-grid-title"
              >
                {t('pages.membership.blog.title')}
              </GridTitle>
              <ContentGrid data-testid="blog-grid">
                {data.content.posts.nodes.map((post, index) => {
                  if (!post) {
                    return null
                  }

                  return (
                    <ContentGridItem key={post.id} data-grid-item={index}>
                      <BlogPostItem
                        id={post.id ?? ''}
                        imageUrl={post?.featuredImage?.node?.mediaItemUrl}
                        imageSrcSet={post.featuredImage?.node?.srcSet}
                        title={post.title ?? ''}
                        publishedDate={post.date ?? ''}
                        description={sanitize(post.excerpt ?? '', {
                          allowedTags: [],
                        })}
                        linkTo={`./blog/${post.id}`}
                        data-testid={`post-grid-item-${post.id}`}
                      />
                    </ContentGridItem>
                  )
                })}
              </ContentGrid>
            </Box>
          ) : null}
          {data.content?.videoSeriesItems?.nodes?.length ? (
            <Box mb={4}>
              <SplitPost
                id={data.content.videoSeriesItems.nodes[0]?.id ?? ''}
                title={data.content.videoSeriesItems.nodes[0]?.title ?? ''}
                imageUrl={
                  data.content.videoSeriesItems.nodes[0]?.featuredImage?.node
                    ?.mediaItemUrl
                }
                imageSrcSet={
                  data.content.videoSeriesItems.nodes[0]?.featuredImage?.node
                    ?.srcSet
                }
                publishedDate={
                  data.content.videoSeriesItems.nodes[0]?.date ?? ''
                }
                label={t('pages.membership.video-series.featured-label')}
                description={sanitize(
                  data.content.videoSeriesItems.nodes[0]?.excerpt ?? '',
                  {
                    allowedTags: [],
                  }
                )}
                orientation="right"
                linkTo={`./video-series/${data.content.videoSeriesItems.nodes[0]?.id}`}
                data-testid="featured-video-series-item"
                isVideo
                duration={
                  data.content.videoSeriesItems.nodes[0]?.youtube?.duration ?? 0
                }
              />
            </Box>
          ) : null}

          {data.content?.webinars?.nodes?.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<WebinarIcon />}
                linkTo="./webinars"
                data-testid="webinars-grid-title"
              >
                {t('pages.membership.webinars.title')}
              </GridTitle>
              <ContentGrid data-testid="webinars-grid">
                {data.content.webinars.nodes.map((webinar, index) => {
                  if (!webinar) {
                    return null
                  }

                  return (
                    <ContentGridItem key={webinar.id} data-grid-item={index}>
                      <BlogPostItem
                        id={webinar.id ?? ''}
                        imageUrl={webinar?.featuredImage?.node?.mediaItemUrl}
                        imageSrcSet={webinar?.featuredImage?.node?.srcSet}
                        title={webinar.title ?? ''}
                        publishedDate={webinar.date ?? ''}
                        description={sanitize(webinar.excerpt ?? '', {
                          allowedTags: [],
                        })}
                        linkTo={`./webinars/${webinar.id}`}
                        data-testid={`webinar-grid-item-${webinar.id}`}
                      />
                    </ContentGridItem>
                  )
                })}
              </ContentGrid>
            </Box>
          ) : null}

          {data.content?.videoSeriesItems?.nodes?.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<VideoSeriesIcon />}
                linkTo="./video-series"
                data-testid="video-series-grid-title"
              >
                {t('pages.membership.video-series.title')}
              </GridTitle>
              <ContentGrid data-testid="video-series-grid">
                {data.content.videoSeriesItems.nodes.map((videoItem, index) => {
                  if (!videoItem) {
                    return null
                  }

                  return (
                    <ContentGridItem key={videoItem.id} data-grid-item={index}>
                      <BlogPostItem
                        id={videoItem.id ?? ''}
                        imageUrl={videoItem?.featuredImage?.node?.mediaItemUrl}
                        imageSrcSet={videoItem.featuredImage?.node?.srcSet}
                        title={videoItem.title ?? ''}
                        publishedDate={videoItem.date ?? ''}
                        description={sanitize(videoItem.excerpt ?? '', {
                          allowedTags: [],
                        })}
                        linkTo={`./video-series/${videoItem.id}`}
                        data-testid={`video-series-grid-item-${videoItem.id}`}
                        isVideo
                        duration={videoItem.youtube?.duration ?? 0}
                      />
                    </ContentGridItem>
                  )
                })}
              </ContentGrid>
            </Box>
          ) : null}

          {data.content?.ebooks?.nodes?.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<EbookIcon />}
                linkTo="./ebooks"
                data-testid="ebooks-grid-title"
              >
                {t('pages.membership.ebooks.title')}
              </GridTitle>
              <ContentGrid data-testid="ebooks-grid">
                {data.content.ebooks.nodes.map((ebook, index) => {
                  if (!ebook) {
                    return null
                  }

                  return (
                    <ContentGridItem key={ebook.id} data-grid-item={index}>
                      <BlogPostItem
                        id={ebook.id ?? ''}
                        imageUrl={ebook?.featuredImage?.node?.mediaItemUrl}
                        imageSrcSet={ebook.featuredImage?.node?.srcSet}
                        title={ebook.title ?? ''}
                        publishedDate={ebook.date ?? ''}
                        description={sanitize(ebook.excerpt ?? '', {
                          allowedTags: [],
                        })}
                        linkTo={''}
                        data-testid={`ebook-grid-item-${ebook.id}`}
                        afterDescription={
                          <DownloadButton
                            sx={{ marginTop: 3 }}
                            downloadLink={
                              ebook.downloads?.researchSummaryFile
                                ?.mediaItemUrl ?? ''
                            }
                          >
                            {t('pages.membership.ebooks.download-button')}
                          </DownloadButton>
                        }
                      />
                    </ContentGridItem>
                  )
                })}
              </ContentGrid>
            </Box>
          ) : null}

          {data.content?.researchSummaries?.nodes?.length ? (
            <Box sx={{ marginBottom: 8 }}>
              <GridTitle
                icon={<ResearchSummaryIcon />}
                linkTo="./research-summaries"
                data-testid="research-summaries-grid-title"
              >
                {t('pages.membership.research-summaries.title')}
              </GridTitle>
              <ContentGrid data-testid="research-summaries-grid">
                {data.content.researchSummaries.nodes.map(
                  (researchSummary, index) => {
                    if (!researchSummary) {
                      return null
                    }

                    return (
                      <ContentGridItem
                        key={researchSummary.id}
                        data-grid-item={index}
                      >
                        <BlogPostItem
                          id={researchSummary.id ?? ''}
                          imageUrl={
                            researchSummary?.featuredImage?.node?.mediaItemUrl
                          }
                          imageSrcSet={
                            researchSummary.featuredImage?.node?.srcSet
                          }
                          title={researchSummary.title ?? ''}
                          publishedDate={researchSummary.date ?? ''}
                          description={sanitize(researchSummary.excerpt ?? '', {
                            allowedTags: [],
                          })}
                          linkTo={''}
                          data-testid={`ebook-grid-item-${researchSummary.id}`}
                          afterDescription={
                            <DownloadButton
                              sx={{ marginTop: 3 }}
                              downloadLink={
                                researchSummary.downloads?.researchSummaryFile
                                  ?.mediaItemUrl ?? ''
                              }
                            >
                              {t(
                                'pages.membership.research-summaries.download-button'
                              )}
                            </DownloadButton>
                          }
                        />
                      </ContentGridItem>
                    )
                  }
                )}
              </ContentGrid>
            </Box>
          ) : null}
        </>
      ) : null}
    </Container>
  )
}
