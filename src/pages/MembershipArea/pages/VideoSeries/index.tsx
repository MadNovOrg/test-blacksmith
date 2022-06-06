import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Container, Typography, Box, Grid } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  OrderEnum,
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
  VideoSeriesSummaryFragment,
} from '@app/generated/graphql'
import VIDEO_SERIES_QUERY from '@app/queries/membership/video-series'
import theme from '@app/theme'

import {
  BlogPostItem,
  BlogPostItemSkeleton,
} from '../../components/BlogPostItem'
import { OrderMenu } from '../../components/OrderMenu'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

export const PER_PAGE = 4

const ItemsGridSkeleton: React.FC = () => (
  <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
    <Grid item xs={3}>
      <BlogPostItemSkeleton />
    </Grid>
  </Grid>
)

export const VideoSeries = () => {
  const { t } = useTranslation()
  const [featuredItem, setFeaturedItem] =
    useState<VideoSeriesSummaryFragment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<VideoSeriesQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE + 1, // one more for the featured video
    last: null,
  })

  const shouldSliceRef = useRef(true)

  const [{ data, fetching }] = useQuery<
    VideoSeriesQuery,
    VideoSeriesQueryVariables
  >({
    query: VIDEO_SERIES_QUERY,
    variables: {
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  useEffect(() => {
    if (pagination.first !== PER_PAGE + 1) {
      shouldSliceRef.current = false
    }
  }, [pagination, data])

  const allItems = useMemo(() => {
    if (data?.content?.videoSeriesItems?.nodes?.length) {
      return data.content.videoSeriesItems.nodes.slice(
        shouldSliceRef.current ? 1 : 0,
        data.content.videoSeriesItems.nodes.length
      )
    }

    return []
  }, [data])

  useEffect(() => {
    if (data?.content?.videoSeriesItems?.nodes?.length && !featuredItem) {
      setFeaturedItem(data.content.videoSeriesItems.nodes[0] ?? null)
    }
  }, [data, featuredItem])

  const hasNextPage = data?.content?.videoSeriesItems?.pageInfo?.hasNextPage
  const hasPreviousPage =
    data?.content?.videoSeriesItems?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <Typography variant="h1" color="primary" textAlign="center" padding={6}>
        {t('pages.membership.video-series.title')}
      </Typography>

      <Box mb={8}>
        {featuredItem ? (
          <SplitPost
            id={featuredItem.id}
            title={featuredItem.title ?? ''}
            imageUrl={featuredItem.featuredImage?.node?.mediaItemUrl}
            publishedDate={featuredItem.date ?? ''}
            label={t('pages.membership.video-series.featured-label')}
            description={sanitize(featuredItem.excerpt ?? '', {
              allowedTags: [],
            })}
            orientation="left"
            linkTo={`./${featuredItem.id}`}
            data-testid="featured-video-series-item"
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-video-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary">
        {t('pages.membership.video-series.list-title')}
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
          placeholder={t('pages.membership.video-series.search-placeholder')}
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

      {allItems.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="video-series-grid"
          >
            {allItems.map((item, index) => {
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
                    data-testid={`video-series-grid-item-${item.id}`}
                    isVideo
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
              data-testid="video-series-pagination"
            >
              <ChevronLeft
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before:
                      data?.content?.videoSeriesItems?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }
                sx={{
                  cursor: hasPreviousPage ? 'pointer' : 'default',
                  color: hasPreviousPage
                    ? 'inherit'
                    : theme.palette.text.disabled,
                }}
              />
              <ChevronRight
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.videoSeriesItems?.pageInfo?.endCursor,
                    before: null,
                    last: null,
                  })
                }
                sx={{
                  cursor: hasNextPage ? 'pointer' : 'default',
                  color: hasNextPage ? 'inherit' : theme.palette.text.disabled,
                }}
              />
            </Box>
          ) : null}
        </>
      ) : (
        <Box data-testid="video-items-grid-skeleton">
          <ItemsGridSkeleton />
        </Box>
      )}
    </Container>
  )
}
