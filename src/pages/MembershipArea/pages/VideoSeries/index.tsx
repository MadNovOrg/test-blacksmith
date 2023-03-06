import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Container, Typography, Box, Grid, IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  OrderEnum,
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
  VideoItemSummaryFragment,
} from '@app/generated/graphql'
import { useScrollToElement } from '@app/hooks/useScrollToElement'
import VIDEO_SERIES_QUERY from '@app/queries/membership/video-series'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'
import { PageTitle } from '../../components/PageTitle'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

export const PER_PAGE = 12

const VideoSeries = () => {
  const { t } = useTranslation()
  const [featuredItem, setFeaturedItem] =
    useState<VideoItemSummaryFragment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<VideoSeriesQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

  const scrollToContainer = useRef<HTMLElement>(null)
  const { scrollTo } = useScrollToElement(scrollToContainer)

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
      <PageTitle>{t('pages.membership.video-series.title')}</PageTitle>

      <Box mb={8}>
        {featuredItem ? (
          <SplitPost
            id={featuredItem.id}
            title={featuredItem.title ?? ''}
            imageUrl={featuredItem.featuredImage?.node?.mediaItemUrl}
            imageSrcSet={featuredItem.featuredImage?.node?.srcSet}
            publishedDate={featuredItem.date ?? ''}
            label={t('pages.membership.video-series.featured-label')}
            description={sanitize(featuredItem.excerpt ?? '', {
              allowedTags: [],
            })}
            orientation="left"
            linkTo={`./${featuredItem.id}`}
            data-testid="featured-video-series-item"
            isVideo
            duration={featuredItem.youtube?.duration ?? undefined}
            category={
              featuredItem.videoSeriesCategories?.nodes?.length
                ? {
                    id: featuredItem.videoSeriesCategories.nodes[0]?.id ?? '',
                    name:
                      featuredItem.videoSeriesCategories.nodes[0]?.name ?? '',
                  }
                : undefined
            }
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-video-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary" ref={scrollToContainer}>
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

      {data?.content?.videoSeriesItems?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="video-series-grid"
          >
            {data.content.videoSeriesItems.nodes.map((item, index) => {
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
                    linkTo={`./${item.id}`}
                    data-testid={`video-series-grid-item-${item.id}`}
                    isVideo
                    duration={item.youtube?.duration ?? undefined}
                    category={
                      item.videoSeriesCategories?.nodes?.length
                        ? {
                            id: item.videoSeriesCategories.nodes[0]?.id ?? '',
                            name:
                              item.videoSeriesCategories.nodes[0]?.name ?? '',
                          }
                        : undefined
                    }
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
              <IconButton
                disabled={!hasPreviousPage}
                data-testid="video-series-previous-page"
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before:
                      data?.content?.videoSeriesItems?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                disabled={!hasNextPage}
                data-testid="video-series-next-page"
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.videoSeriesItems?.pageInfo?.endCursor,
                    before: null,
                    last: null,
                  })
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          ) : null}
        </>
      ) : (
        <Box data-testid="video-items-grid-skeleton">
          <ItemsGridSkeleton num={PER_PAGE} />
        </Box>
      )}
    </Container>
  )
}

export default VideoSeries
