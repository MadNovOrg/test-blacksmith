import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildVideoItem } from '@test/mock-data-utils'

import VideoSeries from '.'

describe('page: VideoSeries', () => {
  it('displays skeleton loading while fetching videos', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
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
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
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
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
          <Route path="/video-series/:id" element={<p>Video item page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
    )

    const featuredVideo = screen.getByTestId('featured-video-series-item')

    userEvent.click(
      within(featuredVideo).getByAltText(videoItems[0].title ?? '')
    )

    expect(screen.getByText('Video item page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
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
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
    )

    videoItems.forEach(item => {
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
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
    )

    userEvent.type(screen.getByPlaceholderText('Search videos'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`video-series-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('paginates video items', async () => {
    const firstBatch = buildEntities(13, buildVideoItem)
    const secondBatch = buildEntities(12, buildVideoItem)

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: VideoSeriesQueryVariables
      }) => {
        const videoItems = variables.after ? secondBatch : firstBatch
        const pageInfo: WpPageInfo = {
          ...(variables.after
            ? {
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: 'start-cursor',
                endCursor: null,
              }
            : {
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: 'end-cursor',
              }),
        }

        return fromValue<{ data: VideoSeriesQuery }>({
          data: {
            content: {
              videoSeriesItems: {
                pageInfo,
                nodes: videoItems,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/video-series" element={<VideoSeries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/video-series'] }
    )

    userEvent.click(screen.getByTestId('video-series-next-page'))

    expect(
      within(screen.getByTestId('featured-video-series-item')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`video-series-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`video-series-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('video-series-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('video-series-previous-page'))

    expect(
      within(screen.getByTestId('featured-video-series-item')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`video-series-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`video-series-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('video-series-previous-page')).toBeDisabled()
  })
})
