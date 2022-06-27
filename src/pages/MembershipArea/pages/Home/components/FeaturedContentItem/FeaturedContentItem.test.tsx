import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildWebinar } from '@test/mock-data-utils'

import { FeaturedContentItem } from '.'

describe('component: FeaturedContentItem', () => {
  it('displays the content correctly', async () => {
    const webinar = buildWebinar()

    const data = {
      id: webinar.id,
      title: webinar.title,
      excerpt: webinar.excerpt,
      imageSrcSet: webinar.featuredImage?.node?.srcSet,
      imageUrl: webinar.featuredImage?.node?.mediaItemUrl,
      youtube: {
        url: webinar.youtube?.url,
        duration: webinar.youtube?.duration,
      },
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<p>Webinar page</p>} path="webinars/:id" />
          <Route
            index
            element={
              <FeaturedContentItem
                data={data}
                linkTo={`webinars/${webinar.id}`}
                chipLabel="New webinar"
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(webinar.excerpt ?? '')).toBeInTheDocument()
    expect(screen.getByText(webinar.title ?? '')).toBeInTheDocument()
    expect(screen.getByAltText(webinar.title ?? '')).toBeInTheDocument()
    expect(screen.getByText('New webinar')).toBeInTheDocument()

    userEvent.click(screen.getByText(webinar.title ?? ''))

    await waitFor(() => {
      expect(screen.getByText('Webinar page')).toBeInTheDocument()
    })
  })
})
