import { format } from 'date-fns'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildVideoItem } from '@test/mock-data-utils'

import { VideoSeries } from '.'

describe('page: VideoSeries', () => {
  it('displays skeleton loading while fetching videos', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('featured-video-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('video-items-grid-skeleton')).toBeInTheDocument()
  })

  it('displays first video item as a featured one', () => {
    const videoItems = buildEntities(2, buildVideoItem)

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                nodes: videoItems,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(
      screen.queryByTestId('featured-video-skeleton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('video-items-grid-skeleton')
    ).not.toBeInTheDocument()

    const featuredVideo = screen.getByTestId('featured-video-series-item')

    expect(
      within(featuredVideo).getByText(videoItems[0].title ?? '')
    ).toBeInTheDocument()

    expect(within(featuredVideo).getByText('New video')).toBeInTheDocument()

    expect(
      within(featuredVideo).getByAltText(videoItems[0].title ?? '')
    ).toHaveAttribute(
      'src',
      videoItems[0].featuredImage?.node?.mediaItemUrl ?? ''
    )
  })

  it('navigates to single video page when clicked on featured image', () => {
    const videoItems = buildEntities(2, buildVideoItem)

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                nodes: videoItems,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
            <Route path="/video-series/:id" element={<p>Video item page</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const featuredVideo = screen.getByTestId('featured-video-series-item')

    userEvent.click(
      within(featuredVideo).getByAltText(videoItems[0].title ?? '')
    )

    expect(screen.getByText('Video item page'))
  })

  it('displays items other than the first one in a grid', () => {
    const videoItems = buildEntities(10, buildVideoItem)

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                nodes: videoItems,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(
      screen.queryByTestId(`video-series-grid-item-${videoItems[0].id}`)
    ).not.toBeInTheDocument()

    videoItems.slice(1, videoItems.length).forEach(item => {
      const itemElement = screen.getByTestId(
        `video-series-grid-item-${item.id}`
      )

      expect(
        within(itemElement).getByText(item.title ?? '')
      ).toBeInTheDocument()
      expect(
        within(itemElement).getByAltText(item.title ?? '')
      ).toHaveAttribute('src', item.featuredImage?.node?.mediaItemUrl ?? '')

      expect(
        within(itemElement).getByText(
          format(new Date(item.date ?? ''), 'd MMMM yyyy')
        )
      ).toBeInTheDocument()
    })
  })

  it('searches for a video item in a series', async () => {
    const videoItems = buildEntities(10, buildVideoItem)
    const filteredItem = buildVideoItem()
    const SEARCH_TERM = 'search term'

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: VideoSeriesQueryVariables
      }) => {
        const items =
          variables.term === SEARCH_TERM ? [filteredItem] : videoItems

        return fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                nodes: items,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText('Search videos'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`video-series-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('displays pagination if there is more content', () => {
    const videoItems = buildEntities(10, buildVideoItem)

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: false,
                },
                nodes: videoItems,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/video-series']}>
          <Routes>
            <Route path="/video-series" element={<VideoSeries />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('video-series-pagination')).toBeInTheDocument()
  })
})
