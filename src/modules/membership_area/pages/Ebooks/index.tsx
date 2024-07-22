import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Container, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  EbooksQuery,
  EbooksQueryVariables,
  EbookSummaryFragment,
  OrderEnum,
} from '@app/generated/graphql'
import { useScrollToElement } from '@app/modules/membership_area/hooks/useScrollToElement'
import EBOOKS_QUERY from '@app/modules/membership_area/queries/ebooks'
import { DEFAULT_PAGINATION_LIMIT } from '@app/util'

import { BlogPostItem } from '../../components/BlogPostItem'
import { DownloadButton } from '../../components/DownloadButton'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'
import { PageTitle } from '../../components/PageTitle'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

const Ebooks: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [featuredItem, setFeaturedItem] = useState<EbookSummaryFragment | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<EbooksQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: DEFAULT_PAGINATION_LIMIT,
    last: null,
  })

  const scrollToContainer = useRef<HTMLElement>(null)
  const { scrollTo } = useScrollToElement(scrollToContainer)

  const [{ data, fetching }] = useQuery<EbooksQuery, EbooksQueryVariables>({
    query: EBOOKS_QUERY,
    variables: {
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  useEffect(() => {
    if (data?.content?.ebooks?.nodes?.length && !featuredItem) {
      setFeaturedItem(data.content.ebooks.nodes[0] ?? null)
    }
  }, [data, featuredItem])

  const hasNextPage = data?.content?.ebooks?.pageInfo?.hasNextPage
  const hasPreviousPage = data?.content?.ebooks?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <PageTitle>{t('pages.membership.ebooks.title')}</PageTitle>

      <Box mb={8}>
        {featuredItem ? (
          <SplitPost
            id={featuredItem.id}
            title={featuredItem.title ?? ''}
            imageUrl={featuredItem.featuredImage?.node?.mediaItemUrl}
            imageSrcSet={featuredItem.featuredImage?.node?.srcSet}
            publishedDate={featuredItem.date ?? ''}
            label={t('pages.membership.ebooks.featured-label')}
            description={sanitize(featuredItem.excerpt ?? '', {
              allowedTags: [],
            })}
            orientation="left"
            linkTo=""
            data-testid="featured-ebook"
            category={
              featuredItem.ebooksCategories?.nodes?.length
                ? {
                    id: featuredItem.ebooksCategories.nodes[0]?.id ?? '',
                    name: featuredItem.ebooksCategories.nodes[0]?.name ?? '',
                  }
                : undefined
            }
            afterDescription={
              <DownloadButton
                sx={{ marginTop: 3 }}
                downloadLink={featuredItem.downloads?.file?.mediaItemUrl ?? ''}
              >
                {t('pages.membership.ebooks.download-button')}
              </DownloadButton>
            }
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-ebook-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary" ref={scrollToContainer}>
        {t('pages.membership.ebooks.list-title')}
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={5}>
        <FilterSearch
          onChange={value => {
            setPagination({
              after: null,
              before: null,
              first: DEFAULT_PAGINATION_LIMIT,
              last: null,
            })
            setSearchTerm(value)
          }}
          placeholder={t('pages.membership.ebooks.search-placeholder')}
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
              first: DEFAULT_PAGINATION_LIMIT,
            })
            setOrderDirection(direction as unknown as OrderEnum)
          }}
        />
      </Box>

      {data?.content?.ebooks?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="ebooks-grid"
          >
            {data.content.ebooks.nodes.map((item, index) => {
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
                    title={item.title ?? ''}
                    publishedDate={item.date ?? ''}
                    description={sanitize(item.excerpt ?? '', {
                      allowedTags: [],
                    })}
                    linkTo=""
                    data-testid={`ebook-grid-item-${item.id}`}
                    category={
                      item.ebooksCategories?.nodes?.length
                        ? {
                            id: item.ebooksCategories.nodes[0]?.id ?? '',
                            name: item.ebooksCategories.nodes[0]?.name ?? '',
                          }
                        : undefined
                    }
                    afterDescription={
                      <DownloadButton
                        sx={{ marginTop: 3 }}
                        downloadLink={item.downloads?.file?.mediaItemUrl ?? ''}
                      >
                        {t('pages.membership.ebooks.download-button')}
                      </DownloadButton>
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
              data-testid="ebooks-pagination"
            >
              <IconButton
                disabled={!hasPreviousPage}
                data-testid="ebooks-previous-page"
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before: data?.content?.ebooks?.pageInfo?.startCursor,
                    last: DEFAULT_PAGINATION_LIMIT,
                  })
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                disabled={!hasNextPage}
                data-testid="ebooks-next-page"
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: DEFAULT_PAGINATION_LIMIT,
                    after: data?.content?.ebooks?.pageInfo?.endCursor,
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
        <Box data-testid="ebooks-grid-skeleton">
          <ItemsGridSkeleton num={DEFAULT_PAGINATION_LIMIT} />
        </Box>
      )}
    </Container>
  )
}

export default Ebooks
