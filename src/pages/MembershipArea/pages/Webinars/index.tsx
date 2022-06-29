import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Container, Typography, Box, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  OrderEnum,
  WebinarsQuery,
  WebinarsQueryVariables,
  WebinarSummaryFragment,
} from '@app/generated/graphql'
import WEBINARS_QUERY from '@app/queries/membership/webinars'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'
import { PageTitle } from '../../components/PageTitle'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

export const PER_PAGE = 12

const Webinars = () => {
  const { t } = useTranslation()
  const [featuredItem, setFeaturedItem] =
    useState<WebinarSummaryFragment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<WebinarsQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

  const [{ data, fetching }] = useQuery<WebinarsQuery, WebinarsQueryVariables>({
    query: WEBINARS_QUERY,
    variables: {
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  useEffect(() => {
    if (data?.content?.webinars?.nodes?.length && !featuredItem) {
      setFeaturedItem(data.content.webinars.nodes[0] ?? null)
    }
  }, [data, featuredItem])

  const hasNextPage = data?.content?.webinars?.pageInfo?.hasNextPage
  const hasPreviousPage = data?.content?.webinars?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <PageTitle>{t('pages.membership.webinars.title')}</PageTitle>

      <Box mb={8}>
        {featuredItem ? (
          <SplitPost
            id={featuredItem.id}
            title={featuredItem.title ?? ''}
            imageUrl={featuredItem.featuredImage?.node?.mediaItemUrl}
            imageSrcSet={featuredItem.featuredImage?.node?.srcSet}
            publishedDate={featuredItem.date ?? ''}
            label={t('pages.membership.webinars.featured-label')}
            description={sanitize(featuredItem.excerpt ?? '', {
              allowedTags: [],
            })}
            orientation="left"
            linkTo={`./${featuredItem.id}`}
            data-testid="featured-webinar"
            isVideo
            duration={featuredItem.youtube?.duration ?? undefined}
            category={
              featuredItem.webinarsCategories?.nodes?.length
                ? {
                    id: featuredItem.webinarsCategories.nodes[0]?.id ?? '',
                    name: featuredItem.webinarsCategories.nodes[0]?.name ?? '',
                  }
                : undefined
            }
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-webinar-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary">
        {t('pages.membership.webinar.list-title')}
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
          placeholder={t('pages.membership.webinars.search-placeholder')}
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

      {data?.content?.webinars?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="webinars-grid"
          >
            {data.content.webinars.nodes.map((item, index) => {
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
                    data-testid={`webinar-grid-item-${item.id}`}
                    isVideo
                    duration={item.youtube?.duration ?? undefined}
                    category={
                      item.webinarsCategories?.nodes?.length
                        ? {
                            id: item.webinarsCategories.nodes[0]?.id ?? '',
                            name: item.webinarsCategories.nodes[0]?.name ?? '',
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
              data-testid="webinars-pagination"
            >
              <IconButton
                disabled={!hasPreviousPage}
                data-testid="webinars-previous-page"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before: data?.content?.webinars?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                disabled={!hasNextPage}
                data-testid="webinars-next-page"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.webinars?.pageInfo?.endCursor,
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
        <Box data-testid="webinars-grid-skeleton">
          <ItemsGridSkeleton />
        </Box>
      )}
    </Container>
  )
}

export default Webinars
