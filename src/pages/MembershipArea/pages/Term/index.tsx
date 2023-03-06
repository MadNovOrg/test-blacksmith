import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Container, IconButton, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  OrderEnum,
  TermQuery,
  TermQueryVariables,
} from '@app/generated/graphql'
import { useScrollToElement } from '@app/hooks/useScrollToElement'
import term from '@app/queries/membership/term'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ContentItemGrid } from '../../components/ContentItemGrid'
import { DownloadButton } from '../../components/DownloadButton'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'

export const PER_PAGE = 12

const Pagination: React.FC<
  React.PropsWithChildren<{
    onPrevClick: () => void
    onNextClick: () => void
    hasNextPage: boolean
    hasPreviousPage: boolean
  }>
> = ({ onPrevClick, onNextClick, hasPreviousPage, hasNextPage }) => {
  if (!hasNextPage && !hasPreviousPage) {
    return null
  }

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      mt={2}
      data-testid="term-items-pagination"
    >
      <IconButton
        disabled={!hasPreviousPage}
        data-testid="term-previous-page"
        onClick={onPrevClick}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        disabled={!hasNextPage}
        data-testid="term-next-page"
        onClick={onNextClick}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  )
}

const initialPagination = {
  after: null,
  before: null,
  first: PER_PAGE,
  last: null,
}

type TermType =
  | 'Category'
  | 'Tag'
  | 'EbooksCategory'
  | 'WebinarsCategory'
  | 'PostFormat'
  | 'ResearchSummariesCategory'
  | 'VideoSeriesCategory'

const Term: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const scrollToContainer = useRef<HTMLDivElement>(null)
  const { scrollTo } = useScrollToElement(scrollToContainer)

  const termSearchMap: Record<TermType, string> = useMemo(
    () => ({
      Category: t('pages.membership.blog.search-placeholder'),
      Tag: t('pages.membership.blog.search-placeholder'),
      PostFormat: t('pages.membership.blog.search-placeholder'),
      EbooksCategory: t('pages.membership.ebooks.search-placeholder'),
      WebinarsCategory: t('pages.membership.webinars.search-placeholder'),
      ResearchSummariesCategory: t(
        'pages.membership.research-summaries.search-placeholder'
      ),
      VideoSeriesCategory: t(
        'pages.membership.video-series.search-placeholder'
      ),
    }),
    [t]
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] =
    useState<Pick<TermQueryVariables, 'first' | 'last' | 'before' | 'after'>>(
      initialPagination
    )

  const [{ data, fetching }] = useQuery<TermQuery, TermQueryVariables>({
    query: term,
    variables: {
      id,
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  useEffect(() => {
    setPagination(initialPagination)
  }, [id])

  if (data?.content?.termNode?.__typename === 'ResourceCategory') {
    return null
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ paddingBottom: 5, paddingTop: 5 }}
      ref={scrollToContainer}
    >
      <Typography mb={3} variant="h3" color="primary">
        {fetching && !data?.content?.termNode?.name ? (
          <Skeleton width={200} />
        ) : (
          `${t('pages.membership.blog.results-for')} '${
            data?.content?.termNode?.name
          }'`
        )}
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={5}>
        {fetching && !data?.content?.termNode ? (
          <Skeleton width={200} />
        ) : (
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
            placeholder={
              termSearchMap[data?.content?.termNode?.__typename ?? 'Category']
            }
            value={searchTerm}
            InputProps={{ disableUnderline: true }}
          />
        )}

        {fetching && !data?.content?.termNode ? (
          <Skeleton width={200} />
        ) : (
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
        )}
      </Box>

      {fetching ? (
        <ItemsGridSkeleton data-testid="items-grid-skeleton" num={PER_PAGE} />
      ) : null}

      {!fetching &&
      (data?.content?.termNode?.__typename === 'Category' ||
        data?.content?.termNode?.__typename === 'Tag') &&
      data.content.termNode.posts?.nodes?.length ? (
        <>
          <ContentItemGrid
            data={data.content.termNode.posts.nodes ?? []}
            renderItem={item => {
              if (!item) {
                return null
              }

              return (
                <BlogPostItem
                  id={item.id}
                  imageUrl={item.featuredImage?.node?.mediaItemUrl}
                  imageSrcSet={item.featuredImage?.node?.srcSet}
                  title={item.title ?? ''}
                  publishedDate={item.date ?? ''}
                  description={sanitize(item.excerpt ?? '', {
                    allowedTags: [],
                  })}
                  linkTo={`../blog/${item.id}`}
                  data-testid={`post-grid-item-${item.id}`}
                  tags={item.tags?.nodes?.map(tag => ({
                    id: tag?.id ?? '',
                    name: tag?.name ?? '',
                  }))}
                  category={
                    item.categories?.nodes?.length
                      ? {
                          id: item.categories.nodes[0]?.id ?? '',
                          name: item.categories.nodes[0]?.name ?? '',
                        }
                      : undefined
                  }
                />
              )
            }}
          />

          <Pagination
            hasNextPage={Boolean(
              data.content.termNode.posts.pageInfo?.hasNextPage
            )}
            hasPreviousPage={Boolean(
              data.content.termNode.posts.pageInfo?.hasPreviousPage
            )}
            onPrevClick={() => {
              scrollTo()
              setPagination({
                ...pagination,
                first: null,
                after: null,
                before:
                  data.content?.termNode?.__typename === 'Category' ||
                  data.content?.termNode?.__typename === 'Tag'
                    ? data.content.termNode.posts?.pageInfo?.startCursor
                    : '',
                last: PER_PAGE,
              })
            }}
            onNextClick={() => {
              scrollTo()
              setPagination({
                ...pagination,
                first: PER_PAGE,
                after:
                  data.content?.termNode?.__typename === 'Category' ||
                  data.content?.termNode?.__typename === 'Tag'
                    ? data.content.termNode.posts?.pageInfo?.endCursor
                    : '',
                before: null,
                last: null,
              })
            }}
          />
        </>
      ) : null}

      {data?.content?.termNode?.__typename === 'EbooksCategory' &&
      data.content.termNode.ebooks?.nodes?.length ? (
        <>
          <ContentItemGrid
            data={data.content.termNode.ebooks.nodes ?? []}
            renderItem={item => {
              if (!item) {
                return null
              }

              return (
                <BlogPostItem
                  id={item.id}
                  imageUrl={item.featuredImage?.node?.mediaItemUrl}
                  imageSrcSet={item.featuredImage?.node?.srcSet}
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
              )
            }}
          />

          <Pagination
            hasNextPage={Boolean(
              data.content.termNode.ebooks.pageInfo?.hasNextPage
            )}
            hasPreviousPage={Boolean(
              data.content.termNode.ebooks.pageInfo?.hasPreviousPage
            )}
            onPrevClick={() =>
              setPagination({
                ...pagination,
                first: null,
                after: null,
                before:
                  data.content?.termNode?.__typename === 'EbooksCategory'
                    ? data.content.termNode.ebooks?.pageInfo?.startCursor
                    : '',
                last: PER_PAGE,
              })
            }
            onNextClick={() =>
              setPagination({
                ...pagination,
                first: PER_PAGE,
                after:
                  data.content?.termNode?.__typename === 'EbooksCategory'
                    ? data.content.termNode.ebooks?.pageInfo?.endCursor
                    : '',
                before: null,
                last: null,
              })
            }
          />
        </>
      ) : null}

      {data?.content?.termNode?.__typename === 'WebinarsCategory' &&
      data.content.termNode.webinars?.nodes?.length ? (
        <>
          <ContentItemGrid
            data={data.content.termNode.webinars.nodes ?? []}
            renderItem={item => {
              if (!item) {
                return null
              }

              return (
                <BlogPostItem
                  id={item.id}
                  imageUrl={item.featuredImage?.node?.mediaItemUrl}
                  imageSrcSet={item.featuredImage?.node?.srcSet}
                  title={item.title ?? ''}
                  publishedDate={item.date ?? ''}
                  description={sanitize(item.excerpt ?? '', {
                    allowedTags: [],
                  })}
                  linkTo={`../webinars/${item.id}`}
                  data-testid={`webinar-grid-item-${item.id}`}
                  category={
                    item.webinarsCategories?.nodes?.length
                      ? {
                          id: item.webinarsCategories.nodes[0]?.id ?? '',
                          name: item.webinarsCategories.nodes[0]?.name ?? '',
                        }
                      : undefined
                  }
                />
              )
            }}
          />

          <Pagination
            hasNextPage={Boolean(
              data.content.termNode.webinars.pageInfo?.hasNextPage
            )}
            hasPreviousPage={Boolean(
              data.content.termNode.webinars.pageInfo?.hasPreviousPage
            )}
            onPrevClick={() =>
              setPagination({
                ...pagination,
                first: null,
                after: null,
                before:
                  data.content?.termNode?.__typename === 'WebinarsCategory'
                    ? data.content.termNode.webinars?.pageInfo?.startCursor
                    : '',
                last: PER_PAGE,
              })
            }
            onNextClick={() =>
              setPagination({
                ...pagination,
                first: PER_PAGE,
                after:
                  data.content?.termNode?.__typename === 'WebinarsCategory'
                    ? data.content.termNode.webinars?.pageInfo?.endCursor
                    : '',
                before: null,
                last: null,
              })
            }
          />
        </>
      ) : null}

      {data?.content?.termNode?.__typename === 'ResearchSummariesCategory' &&
      data.content.termNode.researchSummaries?.nodes?.length ? (
        <>
          <ContentItemGrid
            data={data.content.termNode.researchSummaries.nodes ?? []}
            renderItem={item => {
              if (!item) {
                return null
              }

              return (
                <BlogPostItem
                  id={item.id}
                  imageUrl={item.featuredImage?.node?.mediaItemUrl}
                  imageSrcSet={item.featuredImage?.node?.srcSet}
                  title={item.title ?? ''}
                  publishedDate={item.date ?? ''}
                  description={sanitize(item.excerpt ?? '', {
                    allowedTags: [],
                  })}
                  linkTo=""
                  data-testid={`research-summary-grid-item-${item.id}`}
                  category={
                    item.researchSummariesCategories?.nodes?.length
                      ? {
                          id:
                            item.researchSummariesCategories.nodes[0]?.id ?? '',
                          name:
                            item.researchSummariesCategories.nodes[0]?.name ??
                            '',
                        }
                      : undefined
                  }
                  afterDescription={
                    <DownloadButton
                      sx={{ marginTop: 3 }}
                      downloadLink={item.downloads?.file?.mediaItemUrl ?? ''}
                    >
                      {t('pages.membership.research-summaries.download-button')}
                    </DownloadButton>
                  }
                />
              )
            }}
          />

          <Pagination
            hasNextPage={Boolean(
              data.content.termNode.researchSummaries.pageInfo?.hasNextPage
            )}
            hasPreviousPage={Boolean(
              data.content.termNode.researchSummaries.pageInfo?.hasPreviousPage
            )}
            onPrevClick={() =>
              setPagination({
                ...pagination,
                first: null,
                after: null,
                before:
                  data.content?.termNode?.__typename ===
                  'ResearchSummariesCategory'
                    ? data.content.termNode.researchSummaries?.pageInfo
                        ?.startCursor
                    : '',
                last: PER_PAGE,
              })
            }
            onNextClick={() =>
              setPagination({
                ...pagination,
                first: PER_PAGE,
                after:
                  data.content?.termNode?.__typename ===
                  'ResearchSummariesCategory'
                    ? data.content.termNode.researchSummaries?.pageInfo
                        ?.endCursor
                    : '',
                before: null,
                last: null,
              })
            }
          />
        </>
      ) : null}

      {data?.content?.termNode?.__typename === 'VideoSeriesCategory' &&
      data.content.termNode.videoSeriesItems?.nodes?.length ? (
        <>
          <ContentItemGrid
            data={data.content.termNode.videoSeriesItems.nodes ?? []}
            renderItem={item => {
              if (!item) {
                return null
              }

              return (
                <BlogPostItem
                  id={item.id}
                  imageUrl={item.featuredImage?.node?.mediaItemUrl}
                  imageSrcSet={item.featuredImage?.node?.srcSet}
                  title={item.title ?? ''}
                  publishedDate={item.date ?? ''}
                  description={sanitize(item.excerpt ?? '', {
                    allowedTags: [],
                  })}
                  linkTo={`../video-series/${item.id}`}
                  data-testid={`video-series-grid-item-${item.id}`}
                  category={
                    item.videoSeriesCategories?.nodes?.length
                      ? {
                          id: item.videoSeriesCategories.nodes[0]?.id ?? '',
                          name: item.videoSeriesCategories.nodes[0]?.name ?? '',
                        }
                      : undefined
                  }
                />
              )
            }}
          />

          <Pagination
            hasNextPage={Boolean(
              data.content.termNode.videoSeriesItems.pageInfo?.hasNextPage
            )}
            hasPreviousPage={Boolean(
              data.content.termNode.videoSeriesItems.pageInfo?.hasPreviousPage
            )}
            onPrevClick={() =>
              setPagination({
                ...pagination,
                first: null,
                after: null,
                before:
                  data.content?.termNode?.__typename === 'VideoSeriesCategory'
                    ? data.content.termNode.videoSeriesItems?.pageInfo
                        ?.startCursor
                    : '',
                last: PER_PAGE,
              })
            }
            onNextClick={() =>
              setPagination({
                ...pagination,
                first: PER_PAGE,
                after:
                  data.content?.termNode?.__typename === 'VideoSeriesCategory'
                    ? data.content.termNode.videoSeriesItems?.pageInfo
                        ?.endCursor
                    : '',
                before: null,
                last: null,
              })
            }
          />
        </>
      ) : null}
    </Container>
  )
}

export default Term
