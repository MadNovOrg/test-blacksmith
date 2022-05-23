import { format } from 'date-fns'
import { setMedia } from 'mock-match-media'
import React from 'react'

import useZoomMeetingUrl from '@app/hooks/useZoomMeetingLink'
import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'
import {
  courseToCourseInput,
  INPUT_DATE_FORMAT,
  LoadingStatus,
} from '@app/util'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildCourse, buildCourseSchedule } from '@test/mock-data-utils'

import { VenueSelector } from '../VenueSelector'

import CourseForm from '.'

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn().mockReturnValue(<div>Org Selector</div>),
}))

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
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

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
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

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
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

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

  it('displays venue selector if F2F delivery type', async () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    userEvent.click(screen.getByLabelText('Face to face'))

    expect(screen.getByText('Venue selector')).toBeInTheDocument()
    expect(screen.queryByLabelText('Zoom meeting url')).not.toBeInTheDocument()
  })

  it('displays venue selector and zoom meeting field if MIXED delivery type', async () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    userEvent.click(screen.getByLabelText('Both'))

    expect(screen.getByText('Venue selector')).toBeInTheDocument()
    expect(screen.getByLabelText('Zoom meeting url')).toBeInTheDocument()
  })

  it('displays zoom meeting url field if VIRTUAL delivery type', async () => {
    VenueSelectorMocked.mockImplementation(() => <p>Venue selector</p>)

    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

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

    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    await waitFor(() => {
      userEvent.paste(screen.getByLabelText('Start date'), '12/05/2022')
      userEvent.paste(screen.getByLabelText('Start time'), '09:00 AM')
      userEvent.paste(screen.getByLabelText('End date'), '12/04/2022')
      userEvent.paste(screen.getByLabelText('End time'), '08:00 AM')
    })

    expect(
      screen.getByText('End date must be after the start date')
    ).toBeInTheDocument()
  })

  it('validates that min participants is smaller than max participants', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

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

  it('displays organisation selector and contact profile selector if course type is closed', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.getByTestId('profile-selector')).toBeInTheDocument()
  })

  it('renders correct organisation fields for indirect course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for closed course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for indirect course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />)
    })

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })

  it('displays course values if passed as prop', async () => {
    const course = {
      ...buildCourse(),
      go1Integration: true,
      reaccreditation: true,
      deliveryType: CourseDeliveryType.MIXED,
      aolCostOfCourse: 2000,
      schedule: [
        buildCourseSchedule({ overrides: { virtualLink: 'zoom-meeting' } }),
      ],
    }

    await waitFor(() => {
      render(
        <CourseForm
          courseInput={courseToCourseInput(course)}
          type={CourseType.INDIRECT}
        />
      )
    })

    expect(screen.getByDisplayValue(course.level)).toBeInTheDocument()
    expect(screen.getByLabelText('Go1: Blended learning')).toBeChecked()
    expect(screen.getByLabelText('Reaccreditation')).toBeChecked()
    expect(screen.getByLabelText('Both')).toBeChecked()
    expect(screen.getByLabelText('Zoom meeting url')).toHaveValue(
      'zoom-meeting'
    )
    expect(screen.getByLabelText('Start date')).toHaveValue(
      format(new Date(course.schedule[0].start), INPUT_DATE_FORMAT)
    )
    expect(screen.getByLabelText('Start time')).toHaveValue(
      format(new Date(course.schedule[0].start), 'hh:mm aa')
    )
    expect(
      screen.getByLabelText('I will be using an AOL for this course')
    ).toBeChecked()
    expect(screen.getByPlaceholderText('Cost of course')).toHaveValue(
      String(course.aolCostOfCourse)
    )
    expect(screen.getByLabelText('Number of attendees')).toHaveValue(
      course.max_participants
    )
  })

  it('makes start time and end time mandatory fields', async () => {
    const course = {
      ...buildCourse(),
      go1Integration: true,
      reaccreditation: true,
      deliveryType: CourseDeliveryType.MIXED,
      aolCostOfCourse: 2000,
      schedule: [
        buildCourseSchedule({ overrides: { virtualLink: 'zoom-meeting' } }),
      ],
    }

    const onChangeMock = jest.fn()

    await waitFor(() => {
      render(
        <CourseForm
          courseInput={courseToCourseInput(course)}
          type={CourseType.INDIRECT}
          onChange={onChangeMock}
        />
      )
    })

    userEvent.clear(screen.getByLabelText('Start time'))
    userEvent.clear(screen.getByLabelText('End time'))

    expect(onChangeMock.mock.calls[onChangeMock.mock.calls.length - 1]).toEqual(
      [expect.any(Object), false]
    )
  })
})
