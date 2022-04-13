import { setMedia } from 'mock-match-media'
import React from 'react'

import useZoomMeetingUrl from '@app/hooks/useZoomMeetingLink'
import { CourseLevel, CourseType } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent, within, waitFor } from '@test/index'

import { VenueSelector } from '../VenueSelector'

import CourseForm from '.'

jest.mock('../VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))

jest.mock('@app/hooks/useZoomMeetingLink')

const VenueSelectorMocked = jest.mocked(VenueSelector)
const useZoomMeetingUrlMocked = jest.mocked(useZoomMeetingUrl)

describe('component: CourseForm', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>venue selector mock</p>)
    useZoomMeetingUrlMocked.mockReturnValue({
      meetingUrl: '',
      status: LoadingStatus.SUCCESS,
      generateLink: jest.fn(),
    })
  })

  it('allows LEVEL 1 course to be of any delivery type', async () => {
    render(<CourseForm type={CourseType.OPEN} />)

    const select = screen.getByTestId('course-level-select')

    userEvent.click(within(select).getByRole('button'))

    await waitFor(() => {
      userEvent.click(
        screen.getByTestId(`course-level-option-${CourseLevel.LEVEL_1}`)
      )
    })

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('limits LEVEL 2 course to be either F2F or MIXED type', async () => {
    render(<CourseForm type={CourseType.OPEN} />)

    const select = screen.getByTestId('course-level-select')

    userEvent.click(within(select).getByRole('button'))

    await waitFor(() => {
      userEvent.click(
        screen.getByTestId(`course-level-option-${CourseLevel.LEVEL_2}`)
      )
    })

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('limits ADVANCED course to only be F2F type', async () => {
    render(<CourseForm type={CourseType.OPEN} />)

    const select = screen.getByTestId('course-level-select')

    userEvent.click(within(select).getByRole('button'))

    await waitFor(() => {
      userEvent.click(
        screen.getByTestId(`course-level-option-${CourseLevel.ADVANCED}`)
      )
    })

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('displays venue selector if F2F delivery type', () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    render(<CourseForm type={CourseType.OPEN} />)

    userEvent.click(screen.getByLabelText('Face to face'))

    expect(screen.getByText('Venue selector')).toBeInTheDocument()
    expect(screen.queryByLabelText('Zoom meeting url')).not.toBeInTheDocument()
  })

  it('displays venue selector and zoom meeting field if MIXED delivery type', () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    render(<CourseForm type={CourseType.OPEN} />)

    userEvent.click(screen.getByLabelText('Both'))

    expect(screen.getByText('Venue selector')).toBeInTheDocument()
    expect(screen.getByLabelText('Zoom meeting url')).toBeInTheDocument()
  })

  it('displays zoom meeting url field if VIRTUAL delivery type', async () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    render(<CourseForm type={CourseType.OPEN} />)

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('Virtual'))
    })

    expect(screen.queryByText('Venue selector')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Zoom meeting url')).toBeInTheDocument()
  })

  it('validates that end date must be after start date', async () => {
    // renders MUI datepicker in desktop mode
    setMedia({
      pointer: 'fine',
    })

    render(<CourseForm type={CourseType.OPEN} />)

    await waitFor(() => {
      userEvent.paste(screen.getByLabelText('Start date'), '2022-04-12')
      userEvent.paste(screen.getByLabelText('Start time'), '09:00 am')
      userEvent.paste(screen.getByLabelText('End date'), '2022-04-12')
      userEvent.paste(screen.getByLabelText('End time'), '08:00 am')
    })

    expect(
      screen.getByText('End date must be after the start date')
    ).toBeInTheDocument()
  })

  it('validates that min participants is smaller than max participants', async () => {
    render(<CourseForm type={CourseType.OPEN} />)

    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Minimum'), '6')
      userEvent.type(screen.getByLabelText('Maximum'), '5')
    })

    expect(
      screen.getByText(
        'Minimum number of attendees must be less than the maximum number of attendees'
      )
    ).toBeInTheDocument()
  })

  it('displays organisation selector and contact profile selector if course type is closed', () => {
    render(<CourseForm type={CourseType.CLOSED} />)

    expect(screen.getByTestId('org-selector')).toBeInTheDocument()
    expect(screen.getByTestId('profile-selector')).toBeInTheDocument()
  })

  it('renders correct organisation fields for indirect course type', () => {
    render(<CourseForm type={CourseType.INDIRECT} />)

    expect(screen.getByTestId('org-selector')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for closed course type', () => {
    render(<CourseForm type={CourseType.CLOSED} />)

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for indirect course type', () => {
    render(<CourseForm type={CourseType.INDIRECT} />)

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })
})
