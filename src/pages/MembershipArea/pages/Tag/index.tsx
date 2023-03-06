import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  Box,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import { OrderEnum, TagQuery, TagQueryVariables } from '@app/generated/graphql'
import { useScrollToElement } from '@app/hooks/useScrollToElement'
import TAG_QUERY from '@app/queries/membership/tag'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'

export const PER_PAGE = 12

const Tag: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<TagQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

  const scrollToContainer = useRef<HTMLDivElement>(null)
  const { scrollTo } = useScrollToElement(scrollToContainer)

  const [{ data, fetching }] = useQuery<TagQuery, TagQueryVariables>({
    query: TAG_QUERY,
    variables: {
      id,
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  const hasNextPage = data?.content?.tag?.posts?.pageInfo?.hasNextPage
  const hasPreviousPage = data?.content?.tag?.posts?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container
      maxWidth="lg"
      sx={{ paddingBottom: 5, paddingTop: 5 }}
      ref={scrollToContainer}
    >
      <Typography mb={3} variant="h3" color="primary">
        {fetching && !data?.content?.tag?.name ? (
          <Skeleton width={200} />
        ) : (
          `${t('pages.membership.blog.results-for')} '${
            data?.content?.tag?.name
          }'`
        )}
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

      {data?.content?.tag?.posts?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="posts-grid"
          >
            {data.content.tag.posts.nodes.map((item, index) => {
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
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before: data?.content?.tag?.posts?.pageInfo?.startCursor,
                    last: PER_PAGE,
                  })
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                data-testid="posts-next-page"
                disabled={!hasNextPage}
                onClick={() => {
                  scrollTo()
                  setPagination({
                    ...pagination,
                    first: PER_PAGE,
                    after: data?.content?.tag?.posts?.pageInfo?.endCursor,
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
        <Box data-testid="posts-items-grid-skeleton">
          <ItemsGridSkeleton />
        </Box>
      )}
    </Container>
  )
}

export default Tag
