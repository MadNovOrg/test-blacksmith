import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { VideoItemQuery } from '@app/generated/graphql'

import { screen, render, within } from '@test/index'
import { buildEntities, buildVideoItem } from '@test/mock-data-utils'

import { VideoItem } from '.'

describe('page: VideoItem', () => {
  it('displays skeleton while loading the content', () => {
    const VIDEO_ITEM_ID = 'video-item-id'

    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/video-series/${VIDEO_ITEM_ID}`]}>
          <Routes>
            <Route path="/video-series/:id" element={<VideoItem />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('back-nav-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('description-skeleton')).toBeInTheDocument()
    expect(
      screen.getByTestId('related-video-items-skeleton')
    ).toBeInTheDocument()
  })

  it('displays an alert if video item is not found', () => {
    const VIDEO_ITEM_ID = 'video-item-id'

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoItemQuery }>({
          data: {
            content: {
              videoSeriesItem: null,
              recentVideoItems: {
                nodes: buildEntities(4, buildVideoItem),
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/video-series/${VIDEO_ITEM_ID}`]}>
          <Routes>
            <Route path="/video-series/:id" element={<VideoItem />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Video series item not found')).toBeInTheDocument()
  })

  it('displays video item details', () => {
    const VIDEO_ITEM_ID = 'video-item-id'
    const videoItem = buildVideoItem({ overrides: { id: VIDEO_ITEM_ID } })

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoItemQuery }>({
          data: {
            content: {
              videoSeriesItem: videoItem,
              recentVideoItems: {
                nodes: buildEntities(4, buildVideoItem),
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/video-series/${VIDEO_ITEM_ID}`]}>
          <Routes>
            <Route path="/video-series/:id" element={<VideoItem />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('video-item-title')).toHaveTextContent(
      videoItem.title ?? ''
    )

    const description = screen.getByTestId('video-item-description').textContent
    expect(videoItem.excerpt).toContain(description)
  })

  it('displays related items', () => {
    const VIDEO_ITEM_ID = 'video-item-id'
    const videoItem = buildVideoItem({ overrides: { id: VIDEO_ITEM_ID } })

    const relatedItems = buildEntities(4, buildVideoItem)

    const client = {
      executeQuery: () =>
        fromValue<{ data: VideoItemQuery }>({
          data: {
            content: {
              videoSeriesItem: videoItem,
              recentVideoItems: {
                nodes: relatedItems,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/video-series/${VIDEO_ITEM_ID}`]}>
          <Routes>
            <Route path="/video-series/:id" element={<VideoItem />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    relatedItems.forEach(relatedItem => {
      const relatedItemEl = screen.getByTestId(
        `video-series-grid-item-${relatedItem.id}`
      )

      expect(
        within(relatedItemEl).getByText(relatedItem.title ?? '')
      ).toBeInTheDocument()

      expect(
        within(relatedItemEl).getByAltText(relatedItem.title ?? '')
      ).toHaveAttribute(
        'src',
        relatedItem.featuredImage?.node?.mediaItemUrl ?? ''
      )
    })
  })
})
