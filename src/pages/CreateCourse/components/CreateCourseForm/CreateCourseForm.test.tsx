import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { VenueSelector } from '@app/components/VenueSelector'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { LoadingStatus } from '@app/util'

import { render, userEvent, screen, waitFor } from '@test/index'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { CreateCourseForm } from '.'

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))

jest.mock('@app/hooks/useZoomMeetingLink')

const VenueSelectorMocked = jest.mocked(VenueSelector)
const useZoomMeetingUrlMocked = jest.mocked(useZoomMeetingLink)

describe('component: CreateCourseForm', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
    useZoomMeetingUrlMocked.mockReturnValue({
      meetingUrl: '',
      generateLink: jest.fn(),
      status: LoadingStatus.SUCCESS,
    })
  })

  it('conditionally renders assign assists for indirect course type', async () => {
    render(
      <MemoryRouter initialEntries={['/?type=INDIRECT']}>
        <Routes>
          <Route
            path="/"
            element={
              <CreateCourseProvider>
                <CreateCourseForm />
              </CreateCourseProvider>
            }
          />
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
