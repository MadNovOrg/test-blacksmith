import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { VenueSelector } from '@app/components/VenueSelector'

import { render, userEvent, screen, waitFor } from '@test/index'

import { CreateCourseForm } from '.'

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))

jest.mock('@app/hooks/useZoomMeetingLink')

const VenueSelectorMocked = jest.mocked(VenueSelector)

describe('component: CreateCourseForm', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
  })

  it('conditionally renders assign assists for indirect course type', async () => {
    render(
      <MemoryRouter initialEntries={['/?type=INDIRECT']}>
        <Routes>
          <Route path="/" element={<CreateCourseForm />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('SearchTrainers-input')).not.toBeInTheDocument()

    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Number of attendees'), '24')
    })

    expect(screen.getByTestId('SearchTrainers-input')).toBeInTheDocument()
    expect(screen.getByText('2 assist trainers needed.'))
  })
})
