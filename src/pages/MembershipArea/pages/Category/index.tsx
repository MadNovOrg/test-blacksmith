import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  Box,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import sanitize from 'sanitize-html'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  CategoryQuery,
  CategoryQueryVariables,
  OrderEnum,
} from '@app/generated/graphql'
import CATEGORY_QUERY from '@app/queries/membership/category'

import { BlogPostItem } from '../../components/BlogPostItem'
import { ItemsGridSkeleton } from '../../components/ItemsGridSkeleton'
import { OrderMenu } from '../../components/OrderMenu'

export const PER_PAGE = 12

export const Category: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const [searchTerm, setSearchTerm] = useState('')
  const [orderDirection, setOrderDirection] = useState(OrderEnum.Desc)
  const [pagination, setPagination] = useState<
    Pick<CategoryQueryVariables, 'first' | 'last' | 'before' | 'after'>
  >({
    after: null,
    before: null,
    first: PER_PAGE,
    last: null,
  })

  const [{ data, fetching }] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CATEGORY_QUERY,
    variables: {
      id,
      term: searchTerm,
      orderDirection,
      ...pagination,
    },
  })

  const hasNextPage = data?.content?.category?.posts?.pageInfo?.hasNextPage
  const hasPreviousPage =
    data?.content?.category?.posts?.pageInfo?.hasPreviousPage

  const hasPagination = hasNextPage || hasPreviousPage

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5, paddingTop: 5 }}>
      <Typography mb={3} variant="h3" color="primary">
        {fetching && !data?.content?.category?.name ? (
          <Skeleton width={200} />
        ) : (
          `${t('pages.membership.blog.results-for')} '${
            data?.content?.category?.name
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

      {data?.content?.category?.posts?.nodes?.length && !fetching ? (
        <>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            data-testid="posts-grid"
          >
            {data.content.category.posts.nodes.map((item, index) => {
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
                onClick={() =>
                  setPagination({
                    ...pagination,
                    first: null,
                    after: null,
                    before:
                      data?.content?.category?.posts?.pageInfo?.startCursor,
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
                    after: data?.content?.category?.posts?.pageInfo?.endCursor,
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
