import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Container, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
import EBOOKS_QUERY from '@app/queries/membership/ebooks'

import { BlogPostItem } from '../../components/BlogPostItem'
import { DownloadButton } from '../../components/DownloadButton'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'
import { SplitPost, SplitPostSkeleton } from '../../components/SplitPost'

export const PER_PAGE = 12

export const Ebooks: React.FC = () => {
  const { t } = useTranslation()
  const [featuredItem, setFeaturedItem] = useState<EbookSummaryFragment | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<EbooksQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

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
      <Typography variant="h1" color="primary" textAlign="center" padding={6}>
        {t('pages.membership.ebooks.title')}
      </Typography>

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
            afterDescription={
              <DownloadButton
                sx={{ marginTop: 3 }}
                downloadLink={
                  featuredItem.downloads?.researchSummaryFile?.mediaItemUrl ??
                  ''
                }
              >
                {t('pages.membership.ebooks.download-button')}
              </DownloadButton>
            }
          />
        ) : fetching ? (
          <SplitPostSkeleton data-testid="featured-ebook-skeleton" />
        ) : null}
      </Box>

      <Typography mb={3} variant="h3" color="primary">
        {t('pages.membership.ebooks.list-title')}
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
              first: PER_PAGE,
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
                <Grid item key={item.id} xs={3} data-grid-item={index}>
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
                    afterDescription={
                      <DownloadButton
                        sx={{ marginTop: 3 }}
                        downloadLink={
                          item.downloads?.researchSummaryFile?.mediaItemUrl ??
                          ''
                        }
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
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before: data?.content?.ebooks?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                disabled={!hasNextPage}
                data-testid="ebooks-next-page"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.ebooks?.pageInfo?.endCursor,
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
        <Box data-testid="ebooks-grid-skeleton">
          <ItemsGridSkeleton />
        </Box>
      )}
    </Container>
  )
}
