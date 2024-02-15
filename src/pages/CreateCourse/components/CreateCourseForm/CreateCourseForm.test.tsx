import { fireEvent, renderHook } from '@testing-library/react'
import { addDays, addHours } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { VenueSelector } from '@app/components/VenueSelector'
import { Accreditors_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { Course_Level_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import { BildStrategies, ValidCourseInput } from '@app/types'
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
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
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
      id: 'random-id',
      data: {},
      error: {
        name: 'errorName',
        message: 'errorMessage',
      },
      fetching: false,
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
              <CreateCourseProvider courseType={Course_Type_Enum.Indirect}>
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
                courseType={Course_Type_Enum.Indirect}
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
        level: Course_Level_Enum.BildRegular,
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
                courseType={Course_Type_Enum.Indirect}
              >
                <CreateCourseForm />
              </CreateCourseProvider>
            }
          />
        </Routes>
      </Provider>,
      {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
        },
      },
      { initialEntries: ['/?type=INDIRECT'] }
    )

    const confirmations = [
      t('pages.create-course.form.health-leaflet-copy'),
      t('pages.create-course.form.practice-protocol-copy'),
      t('pages.create-course.form.valid-id-copy'),
      t('pages.create-course.form.needs-analysis-copy'),
      t('pages.create-course.form.connect-fee-notification'),
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
