import { fireEvent } from '@testing-library/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { VenueSelector } from '@app/components/VenueSelector'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { CourseType, ValidCourseInput } from '@app/types'
import { courseToCourseInput, LoadingStatus } from '@app/util'

import {
  chance,
  render,
  screen,
  userEvent,
  waitFor,
  waitForCalls,
} from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { CreateCourseForm } from '.'

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))

jest.mock('@app/hooks/useZoomMeetingLink')

jest.mock('@app/hooks/useCourseDraft')

const VenueSelectorMocked = jest.mocked(VenueSelector)
const useZoomMeetingUrlMocked = jest.mocked(useZoomMeetingLink)
const useCourseDraftMocked = jest.mocked(useCourseDraft)

const mockTrainerSearch = jest.fn().mockResolvedValue({ trainers: [] })
jest.mock('@app/components/SearchTrainers/useQueryTrainers', () => ({
  useQueryTrainers: () => ({ search: mockTrainerSearch }),
}))

describe('component: CreateCourseForm', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
    useZoomMeetingUrlMocked.mockReturnValue({
      meetingUrl: '',
      generateLink: jest.fn(),
      status: LoadingStatus.SUCCESS,
    })
    useCourseDraftMocked.mockReturnValue({
      fetchDraft: jest.fn(),
      removeDraft: jest.fn(),
      setDraft: jest.fn(),
    })
  })

  it('renders assign assists for indirect course type', async () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/"
            element={
              <CreateCourseProvider courseType={CourseType.INDIRECT}>
                <CreateCourseForm />
              </CreateCourseProvider>
            }
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/?type=INDIRECT'] }
    )

    expect(screen.queryByTestId('SearchTrainers-input')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Number of attendees'), '24')

    await waitFor(() => {
      expect(screen.getByTestId('SearchTrainers-input')).toBeInTheDocument()
    })
  })

  it('update max allowed trainers according to number of attendees', async () => {
    const overrides = {
      max_participants: 80,
    }
    const course = buildCourse({ overrides })
    const availableTrainers = [
      {
        id: chance.guid(),
        fullName: `Trainer ${chance.name()}`,
        trainer_role_types: [],
      },
      {
        id: chance.guid(),
        fullName: `Trainer ${chance.name()}`,
        trainer_role_types: [],
      },
      {
        id: chance.guid(),
        fullName: `Trainer ${chance.name()}`,
        trainer_role_types: [],
      },
    ]
    mockTrainerSearch.mockResolvedValue({ trainers: availableTrainers })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/"
            element={
              <CreateCourseProvider
                initialValue={{
                  courseData: courseToCourseInput(course) as ValidCourseInput,
                }}
                courseType={CourseType.INDIRECT}
              >
                <CreateCourseForm />
              </CreateCourseProvider>
            }
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/?type=INDIRECT'] }
    )

    const searchTrainersInput = screen.getByTestId('SearchTrainers-input')
    expect(searchTrainersInput).toBeInTheDocument()
    expect(searchTrainersInput).toHaveAttribute(
      'placeholder',
      'Search eligible trainers...'
    )

    await userEvent.type(searchTrainersInput, 'Trainer')
    await waitForCalls(mockTrainerSearch)

    await waitFor(async () => {
      const options = screen.getAllByTestId('SearchTrainers-option')
      expect(options).toHaveLength(3)
      await userEvent.click(options[0])
    })

    expect(searchTrainersInput).toHaveAttribute(
      'placeholder',
      'Search eligible trainers...'
    )

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Number of attendees'), {
        target: { value: '12' },
      })
    })

    await waitFor(() =>
      expect(screen.getByTestId('SearchTrainers-input')).not.toHaveAttribute(
        'placeholder',
        '(max allowed reached)'
      )
    )
  })
})
