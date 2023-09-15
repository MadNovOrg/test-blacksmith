import { fireEvent } from '@testing-library/react'
import { addDays, addHours } from 'date-fns'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { VenueSelector } from '@app/components/VenueSelector'
import { Accreditors_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import {
  BildStrategies,
  CourseLevel,
  CourseType,
  ValidCourseInput,
} from '@app/types'
import { courseToCourseInput, LoadingStatus } from '@app/util'

import {
  chance,
  render,
  screen,
  userEvent,
  waitFor,
  waitForCalls,
} from '@test/index'
import { buildCourse, buildCourseSchedule } from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { CreateCourseForm } from '.'

vi.mock('@app/hooks/use-fetcher')
const useFetcherMock = vi.mocked(useFetcher)

vi.mock('@app/components/VenueSelector', () => ({
  VenueSelector: vi.fn(),
}))

vi.mock('@app/hooks/useZoomMeetingLink')

vi.mock('@app/hooks/useCourseDraft')

const VenueSelectorMocked = vi.mocked(VenueSelector)
const useZoomMeetingUrlMocked = vi.mocked(useZoomMeetingLink)
const useCourseDraftMocked = vi.mocked(useCourseDraft)

const mockTrainerSearch = vi.fn().mockResolvedValue({ trainers: [] })
vi.mock('@app/components/SearchTrainers/useQueryTrainers', () => ({
  useQueryTrainers: () => ({ search: mockTrainerSearch }),
}))

describe('component: CreateCourseForm', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
    useZoomMeetingUrlMocked.mockReturnValue({
      meetingUrl: '',
      meetingId: 123,
      generateLink: vi.fn(),
      clearLink: vi.fn(),
      status: LoadingStatus.SUCCESS,
    })
    useCourseDraftMocked.mockReturnValue({
      fetchDraft: vi.fn(),
      removeDraft: vi.fn(),
      setDraft: vi.fn(),
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

    await userEvent.type(screen.getByLabelText('Number of attendees *'), '24')

    await waitFor(() => {
      expect(screen.getByTestId('SearchTrainers-input')).toBeInTheDocument()
    })
  })

  /**
   * TODO Shamelessly ignore this test.
   * Come back to this test separately
   * @author Alexei.Gaidulean <alexei.gaidulean@teamteach.co.uk>
   */
  it.skip('update max allowed trainers according to number of attendees', async () => {
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
      fireEvent.change(screen.getByLabelText('Number of attendees *'), {
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

  it("doesn't allow an indirect BILD course to be created with exceptions", async () => {
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
        level: CourseLevel.BildRegular,
        bildStrategies: [{ strategyName: BildStrategies.Primary }],
        max_participants: 10,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    const fetcherMock = vi.fn()
    fetcherMock.mockResolvedValue({
      members: [],
    })
    useFetcherMock.mockReturnValue(fetcherMock)

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
      {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
        },
      },
      { initialEntries: ['/?type=INDIRECT'] }
    )

    const confirmations = [
      'I confirm that I will ensure all course registrants have read the Health Guidance & Training Information.',
      'I confirm that I will follow Team Teach protocols and have the correct first aid protocols in place.',
      'I confirm that I will check that all course attendees have a valid form of ID before commencing the training through either passport, driving licence or organisation verification.',
      'My training needs analysis form has been submitted and approved.',
    ]

    for (const label of confirmations) {
      await userEvent.click(screen.getByLabelText(label, { exact: false }))
    }

    await userEvent.click(
      screen.getByRole('button', { name: /course builder/i })
    )

    const dialog = await screen.findByRole('dialog')

    expect(dialog).toBeInTheDocument()
    expect(dialog.textContent).toMatchInlineSnapshot(
      `"No exceptions allowedThis course does not follow Team Teach training protocols, please review and amend the course date and/or trainer ratios before resubmitting."`
    )
  })
})
