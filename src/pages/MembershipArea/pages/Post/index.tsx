import {
  Container,
  Box,
  Typography,
  Skeleton,
  Link,
  Alert,
  Grid,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { PostQuery, PostQueryVariables } from '@app/generated/graphql'
import POST_QUERY from '@app/queries/membership/post'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { TagChip, TagChipSkeleton } from '../../components/TagChip'

import {
  BleedPostImage,
  BleedPostImageSkeleton,
  PostImageBox,
  RecentPostsBox,
} from './components/layout'
import { PostContent } from './components/PostContent'

const Post: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams() as { id: string }
  const { t } = useTranslation()
  const [{ data, fetching, error }] = useQuery<PostQuery, PostQueryVariables>({
    query: POST_QUERY,
    variables: { id },
  })

  const hasError = (!fetching && !data?.content?.post) || error

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const shouldDisplayAuthor = Boolean(
    data?.content?.post?.customAuthor?.displayAuthor,
  )

  const authorName =
    data?.content?.post?.customAuthor?.authorName ??
    `${data?.content?.post?.author?.node?.firstName} ${data?.content?.post?.author?.node?.lastName}`

  return (
    <Box pb={5} pt={8}>
      <Container maxWidth="md" sx={{ marginBottom: 7 }}>
        <Box mb={6}>
          <Box mb={2}>
            <Typography variant="body2" fontWeight={600} mb={3}>
              {fetching ? (
                <Skeleton
                  width={100}
                  data-testid="back-nav-skeleton"
                  component="span"
                />
              ) : (
                <Link href="../">{t('pages.membership.blog.title')}</Link>
              )}
            </Typography>

            <Typography
              variant="h1"
              color="primary"
              mb={3}
              data-testid="post-title"
            >
              {fetching ? (
                <Box data-testid="title-skeleton" component="span">
                  <Skeleton component="span" />
                  <Skeleton component="span" />
                </Box>
              ) : data?.content?.post ? (
                data.content.post.title
              ) : null}
            </Typography>
            <Typography
              mb={2}
              data-testid="post-description"
              variant="subtitle2"
            >
              {fetching ? (
                <Box data-testid="description-skeleton" component="span">
                  <Skeleton component="span" />
                  <Skeleton component="span" />
                  <Skeleton component="span" />
                </Box>
              ) : data?.content?.post?.excerpt ? (
                sanitize(data.content.post.excerpt, {
                  allowedTags: [],
                })
              ) : null}
            </Typography>

            {shouldDisplayAuthor ? (
              <Typography variant="body2">
                {t('pages.membership.common.author', {
                  author: authorName,
                })}
              </Typography>
            ) : null}

            <Box display="flex" justifyItems="center" mt={2}>
              {fetching ? (
                <>
                  <TagChipSkeleton />
                  <TagChipSkeleton sx={{ marginRight: 1, marginLeft: 1 }} />
                </>
              ) : (
                data?.content?.post?.tags?.nodes?.map(tag => {
                  return (
                    <TagChip
                      key={tag?.id}
                      tag={{ id: tag?.id ?? '', name: tag?.name ?? '' }}
                      sx={{ marginRight: 1 }}
                    />
                  )
                })
              )}

              {fetching ? (
                <Skeleton width={50} component="span" />
              ) : data?.content?.post?.date ? (
                <Typography variant="body2">
                  {t('dates.default', {
                    date: new Date(data.content.post.date),
                  })}
                </Typography>
              ) : null}
            </Box>
          </Box>

          {hasError ? (
            <Alert severity="error">
              {t('pages.membership.blog.not-found')}
            </Alert>
          ) : null}
        </Box>
        <PostImageBox>
          {fetching ? (
            <BleedPostImageSkeleton
              data-testid="image-skeleton"
              variant="rectangular"
            >
              <div style={{ paddingTop: '57%' }} />
            </BleedPostImageSkeleton>
          ) : data?.content?.post?.featuredImage?.node?.mediaItemUrl ? (
            <BleedPostImage
              src={data.content.post.featuredImage.node.mediaItemUrl}
              alt={data.content.post.title ?? ''}
            />
          ) : null}
        </PostImageBox>

        {data?.content?.post?.content && !fetching ? (
          <PostContent content={data.content.post.content} />
        ) : null}
      </Container>
      <RecentPostsBox>
        {data?.content?.recentPosts?.nodes?.length && !fetching && !hasError ? (
          <Box data-testid="recent-posts">
            <Typography mb={3} variant="h3" color="primary">
              {t('pages.membership.blog.recent')}
            </Typography>
            <Grid
              container
              rowSpacing={5}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              data-testid="posts-grid"
            >
              {data.content.recentPosts.nodes.map((item, index) => {
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
                      data-testid={`posts-grid-item-${item.id}`}
                      isVideo
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

            <ItemsGridSkeleton data-testid="recent-posts-skeleton" />
          </>
        ) : null}
      </RecentPostsBox>
    </Box>
  )
}

export default Post
