import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Container, Grid, IconButton, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  BlogQuery,
  BlogQueryVariables,
  OrderEnum,
  PostSummaryFragment,
} from '@app/generated/graphql'
import BLOG_QUERY from '@app/queries/membership/blog'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

const PER_PAGE = 4

export const Blog: React.FC = () => {
  const { t } = useTranslation()
  const [featuredPost, setFeaturedPost] = useState<PostSummaryFragment | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<BlogQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

  const [{ data, fetching }] = useQuery<BlogQuery, BlogQueryVariables>({
    query: BLOG_QUERY,
    variables: {
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  useEffect(() => {
    if (data?.content?.posts?.nodes?.length && !featuredPost) {
      setFeaturedPost(data.content.posts.nodes[0] ?? null)
    }
  }, [data, featuredPost])

  const hasNextPage = data?.content?.posts?.pageInfo?.hasNextPage
  const hasPreviousPage = data?.content?.posts?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <Typography variant="h1" color="primary" textAlign="center" padding={6}>
        {t('pages.membership.blog.title')}
      </Typography>

      <Box mb={8}>
        {featuredPost ? (
          <SplitPost
            id={featuredPost.id}
            title={featuredPost.title ?? ''}
            imageUrl={featuredPost.featuredImage?.node?.mediaItemUrl}
            publishedDate={featuredPost.date ?? ''}
            label={t('pages.membership.blog.featured-label')}
            description={sanitize(featuredPost.excerpt ?? '', {
              allowedTags: [],
            })}
            orientation="left"
            linkTo={`./${featuredPost.id}`}
            data-testid="featured-post-item"
            tags={featuredPost.tags?.nodes?.map(tag => ({
              id: tag?.id ?? '',
              name: tag?.name ?? '',
            }))}
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-post-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary">
        {t('pages.membership.blog.list-title')}
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={5}>
        <FilterSearch
          onChange={value => {
            setPagination({
              after: null,
              before: null,
              first: PER_PAGE,
              last: null,
            })
            setSearchTerm(value)
          }}
          placeholder={t('pages.membership.blog.search-placeholder')}
          value={searchTerm}
          InputProps={{ disableUnderline: true }}
        />
        <OrderMenu
          onChange={direction => {
            setPagination({
              ...pagination,
              after: null,
              before: null,
              last: null,
              first: PER_PAGE,
            })
            setOrderDirection(direction as unknown as OrderEnum)
          }}
        />
      </Box>

      {data?.content?.posts?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="posts-grid"
          >
            {data.content.posts.nodes.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <Grid item key={item.id} xs={3} data-grid-item={index}>
                  <BlogPostItem
                    id={item.id}
                    imageUrl={item.featuredImage?.node?.mediaItemUrl}
                    title={item.title ?? ''}
                    publishedDate={item.date ?? ''}
                    description={sanitize(item.excerpt ?? '', {
                      allowedTags: [],
                    })}
                    linkTo={`./${item.id}`}
                    data-testid={`post-grid-item-${item.id}`}
                    tags={item.tags?.nodes?.map(tag => ({
                      id: tag?.id ?? '',
                      name: tag?.name ?? '',
                    }))}
                  />
                </Grid>
              )
            })}
          </Grid>
          {hasPagination ? (
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={2}
              data-testid="posts-pagination"
            >
              <IconButton
                data-testid="posts-previous-page"
                disabled={!hasPreviousPage}
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before: data?.content?.posts?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                data-testid="posts-next-page"
                disabled={!hasNextPage}
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.posts?.pageInfo?.endCursor,
                    before: null,
                    last: null,
                  })
                }
              >
                <ChevronRight />
              </IconButton>
            </Box>
          ) : null}
        </>
      ) : (
        <Box data-testid="posts-items-grid-skeleton">
          <ItemsGridSkeleton />
        </Box>
      )}
    </Container>
  )
}
