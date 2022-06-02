import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import { FilterSearch } from '@app/components/FilterSearch'
import {
  OrderDirection,
  Podcast,
  PodcastsQuery,
  PodcastsQueryVariables,
} from '@app/generated/graphql'
import PODCASTS_QUERY from '@app/queries/membership/podcasts'

import { ArrowPagination } from '../../components/ArrowPagination'
import { BlogPostItem } from '../../components/BlogPostItem'
import { SplitPost } from '../../components/SplitPost'

import { OrderMenu } from './components/OrderMenu'

export const PER_PAGE = 12

export const Podcasts: React.FC = () => {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1)
  const [orderDirection, setOrderDirection] = useState(OrderDirection.Desc)
  const [searchTerm, setSearchTerm] = useState('')
  const [featuredPodcast, setFeaturedPodcast] = React.useState<Podcast | null>(
    null
  )

  const [{ data, fetching }] = useQuery<PodcastsQuery, PodcastsQueryVariables>({
    query: PODCASTS_QUERY,
    variables: {
      input: {
        paging: {
          perPage: PER_PAGE + (currentPage === 1 ? 1 : 0),
          page: currentPage,
        },
        order: {
          direction: orderDirection,
        },
        term: searchTerm,
      },
    },
  })

  useEffect(() => {
    if (data?.podcasts?.records.length && !featuredPodcast) {
      setFeaturedPodcast(data.podcasts.records[0])
    }
  }, [data, featuredPodcast])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, orderDirection])

  const allPodcasts = useMemo(() => {
    if (data?.podcasts?.records.length) {
      if (
        currentPage === 1 &&
        orderDirection === OrderDirection.Desc &&
        data.podcasts.total > 1
      ) {
        return data.podcasts.records.slice(1, data.podcasts.records.length)
      }

      return data.podcasts.records
    }

    return []
  }, [data, currentPage, orderDirection])

  const handleDirectionChange = (direction: OrderDirection) => {
    setOrderDirection(direction)
  }

  const hasPagination = data?.podcasts ? PER_PAGE < data.podcasts.total : false

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 5 }}>
      <Typography variant="h1" color="primary" textAlign="center" padding={6}>
        {t('pages.membership.podcasts.title')}
      </Typography>

      {!fetching && data?.podcasts?.records.length === 0 ? (
        <Typography>{t('pages.membership.podcasts.empty')}</Typography>
      ) : null}

      {fetching && !featuredPodcast ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : null}

      {featuredPodcast && (
        <Box mb={8}>
          <SplitPost
            id={featuredPodcast.id}
            title={featuredPodcast.name}
            imageUrl={featuredPodcast.thumbnail}
            publishedDate={featuredPodcast.publishedDate}
            label={t('pages.membership.podcasts.featured-label')}
            description={
              `${featuredPodcast.description?.substring(0, 150)}...` ?? ''
            }
            orientation="left"
            linkTo={`./${featuredPodcast.id}`}
            data-testid="featured-podcast"
          />
        </Box>
      )}

      {allPodcasts && data?.podcasts?.total && (
        <>
          <Typography mb={3} variant="h3" color="primary">
            {t('pages.membership.podcasts.list-title')}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={5}>
            <FilterSearch
              onChange={value => setSearchTerm(value)}
              placeholder={t('pages.membership.podcasts.search-placeholder')}
              value={searchTerm}
              InputProps={{ disableUnderline: true }}
            />
            <OrderMenu onChange={handleDirectionChange} />
          </Box>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {allPodcasts.map((podcast, index) => (
              <Grid item key={podcast.id} xs={3} data-grid-item={index}>
                <BlogPostItem
                  id={podcast.id}
                  imageUrl={podcast.thumbnail}
                  title={podcast.name}
                  publishedDate={podcast.publishedDate}
                  description={
                    `${podcast.description?.substring(0, 120)}...` ?? ''
                  }
                  linkTo={`./${podcast.id}`}
                  data-testid={`podcast-grid-item-${podcast.id}`}
                />
              </Grid>
            ))}
          </Grid>
          {hasPagination ? (
            <ArrowPagination
              total={data.podcasts.total}
              data-testid="podcasts-pagination"
              onPageChange={page => setCurrentPage(page)}
            />
          ) : null}
        </>
      )}
    </Container>
  )
}
