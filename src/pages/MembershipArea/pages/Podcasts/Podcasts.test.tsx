import { format } from 'date-fns'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  OrderDirection,
  PodcastsQuery,
  PodcastsQueryVariables,
} from '@app/generated/graphql'

import { render, screen, within, userEvent, waitFor } from '@test/index'
import { buildEntities, buildPodcast } from '@test/mock-data-utils'

import Podcasts, { PER_PAGE } from '.'

describe('page: Podcasts', () => {
  it('displays skeleton while loading podcasts', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Podcasts />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(screen.getByTestId('featured-podcast-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('podcasts-grid-skeleton')).toBeInTheDocument()
  })

  it('displays a message if there are no podcasts', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records: [],
              total: 0,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Podcasts />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(screen.getByText('There are no podcasts yet.')).toBeInTheDocument()
  })

  it('displays first podcast as featured', () => {
    const podcasts = buildEntities(2, buildPodcast)

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records: podcasts,
              total: 10,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Podcasts />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    const featuredPodcast = screen.getByTestId('featured-podcast')

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(
      within(featuredPodcast).getByText(podcasts[0].name)
    ).toBeInTheDocument()
    expect(within(featuredPodcast).getByText('New episode')).toBeInTheDocument()
    expect(
      within(featuredPodcast).getByAltText(podcasts[0].name)
    ).toHaveAttribute('src', podcasts[0].thumbnail)
  })

  it('links to podcast single page when clicked on the featured podcast', () => {
    const podcasts = buildEntities(2, buildPodcast)

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records: podcasts,
              total: 2,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    const featuredPodcast = screen.getByTestId('featured-podcast')

    userEvent.click(within(featuredPodcast).getByText(podcasts[0].name))

    expect(screen.getByText('Single podcast page')).toBeInTheDocument()
  })

  it('displays a list of the podcasts', () => {
    const podcasts = buildEntities(13, buildPodcast)

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records: podcasts,
              total: 13,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(
      screen.queryByTestId(`podcast-grid-item-${podcasts[0].id}`)
    ).not.toBeInTheDocument()

    const paginatedPodcasts = podcasts.slice(1, PER_PAGE)

    paginatedPodcasts.forEach(podcast => {
      const podcastElement = screen.getByTestId(
        `podcast-grid-item-${podcast.id}`
      )

      expect(within(podcastElement).getByText(podcast.name)).toBeInTheDocument()
      expect(within(podcastElement).getByAltText(podcast.name)).toHaveAttribute(
        'src',
        podcast.thumbnail
      )
      expect(
        within(podcastElement).getByText(
          format(new Date(podcast.publishedDate), 'd MMMM yyyy')
        )
      ).toBeInTheDocument()
    })
  })

  it('links to podcast single page when clicked on a podcast in the list', () => {
    const podcasts = buildEntities(13, buildPodcast)

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records: podcasts,
              total: 13,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('featured-podcast')).getByText(podcasts[0].name)
    )
    expect(screen.getByText('Single podcast page')).toBeInTheDocument()
  })

  it('paginates podcasts', () => {
    const firstPodcastBatch = buildEntities(PER_PAGE + 1, buildPodcast)
    const secondPodcastBatch = buildEntities(PER_PAGE, buildPodcast)

    const client = {
      executeQuery: ({ variables }: { variables: PodcastsQueryVariables }) => {
        return fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records:
                variables.input.paging?.page === 1
                  ? firstPodcastBatch
                  : secondPodcastBatch,
              total: 20,
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(screen.getByText('1-12 of 20')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('pagination-next-page'))

    const featuredPodcast = screen.getByTestId('featured-podcast')

    expect(
      within(featuredPodcast).getByText(firstPodcastBatch[0].name)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`podcast-grid-item-${firstPodcastBatch[1].id}`)
    ).not.toBeInTheDocument()
    expect(
      screen.getByTestId(`podcast-grid-item-${secondPodcastBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByText('13-20 of 20')).toBeInTheDocument()
  })

  it('sorts by published date', () => {
    const podcasts = buildEntities(20, buildPodcast)
    const reversedPodcasts = podcasts.slice().reverse()

    const client = {
      executeQuery: ({ variables }: { variables: PodcastsQueryVariables }) => {
        return fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records:
                variables.input.order?.direction === OrderDirection.Asc
                  ? reversedPodcasts.slice(0, PER_PAGE)
                  : podcasts.slice(0, PER_PAGE),
              total: 20,
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(
      within(screen.getByTestId('featured-podcast')).getByText(podcasts[0].name)
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`podcast-grid-item-${podcasts[1].id}`)
    ).toBeInTheDocument()

    userEvent.click(screen.getByTestId('order-menu-button'))
    userEvent.click(screen.getByText('Oldest'))

    expect(
      within(screen.getByTestId('featured-podcast')).getByText(podcasts[0].name)
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`podcast-grid-item-${reversedPodcasts[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`podcast-grid-item-${podcasts[0].id}`)
    ).not.toBeInTheDocument()
  })

  it('filters podcasts by name', async () => {
    const podcasts = buildEntities(20, buildPodcast)
    const filteredPodcast = buildPodcast()
    const SEARCH_TERM = 'search term'

    const client = {
      executeQuery: ({ variables }: { variables: PodcastsQueryVariables }) => {
        const records =
          variables.input.term === SEARCH_TERM
            ? [filteredPodcast]
            : podcasts.slice(0, PER_PAGE)
        return fromValue<{ data: PodcastsQuery }>({
          data: {
            podcasts: {
              records,
              total: records.length,
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/" element={<Podcasts />} />
          <Route path="/:id" element={<p>Single podcast page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.type(screen.getByPlaceholderText('Search podcasts'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`podcast-grid-item-${filteredPodcast.id}`)
      ).toBeInTheDocument()
    })
  })
})
