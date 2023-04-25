import userEvent from '@testing-library/user-event'
import React from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Accreditors_Enum,
  SaveGradingDetailsMutation,
  SaveGradingDetailsMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { MUTATION } from '@app/queries/courses/save-course-attendance'
import { LoadingStatus } from '@app/util'

import { render, screen, waitForText, within } from '@test/index'
import { buildParticipant } from '@test/mock-data-utils'

import { CourseDetailsTabs } from '../../CourseDetails'
import { GradingDetailsProvider } from '../GradingDetailsProvider'

import { CourseAttendance } from './index'

jest.mock('@app/hooks/useCourseParticipants')
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: jest.fn(),
}))

const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)
const useFetcherMock = jest.mocked(useFetcher)

describe('component: CourseAttendance', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays spinner while loading for participants', () => {
    const COURSE_ID = 'course-id'

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={
              <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                <CourseAttendance />
              </GradingDetailsProvider>
            }
          ></Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    expect(screen.getByTestId('participants-fetching')).toBeInTheDocument()
  })

  it('displays course participants', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={
              <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                <CourseAttendance />
              </GradingDetailsProvider>
            }
          ></Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    expect(
      screen.queryByTestId('participants-fetching')
    ).not.toBeInTheDocument()

    participants.forEach(participant => {
      expect(
        screen.getByText(`${participant.profile.fullName}`)
      ).toBeInTheDocument()
    })
  })

  it('displays save attendance for participant if no local storage backup', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={
              <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                <CourseAttendance />
              </GradingDetailsProvider>
            }
          ></Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[0].id}`)
      ).getByText('Automatic fail')
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[1].id}`)
      ).getByText('Clear for grading')
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[2].id}`)
      ).getByText('Clear for grading')
    ).toBeInTheDocument()
  })

  it('saves to local storage when attendance changes', async () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={
              <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                <CourseAttendance />
              </GradingDetailsProvider>
            }
          ></Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    await userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    const storedAttendance = localStorage.getItem(
      `course-attendance-${COURSE_ID}`
    )

    expect(JSON.parse(storedAttendance ?? '')).toEqual({
      [participants[1].id]: true,
      [participants[2].id]: true,
      [participants[0].id]: false,
    })
  })

  it('displays attendance from local storage if it exists for the course', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    localStorage.setItem(
      `course-attendance-${COURSE_ID}`,
      JSON.stringify({
        [participants[0].id]: false,
        [participants[1].id]: true,
        [participants[2].id]: true,
      })
    )

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={
              <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                <CourseAttendance />
              </GradingDetailsProvider>
            }
          ></Route>
        </Routes>
      </Provider>,

      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    expect(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    ).not.toBeChecked()
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('saves course attendance', async () => {
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)

    const COURSE_ID = 10001
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id">
            <Route
              path="grading-details"
              element={
                <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
                  <CourseAttendance />
                </GradingDetailsProvider>
              }
            ></Route>
            <Route
              path="grading-details/modules"
              element={<h3>Modules page</h3>}
            ></Route>
          </Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    await userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    await userEvent.click(
      screen.getByText('Confirm modules and physical techniques')
    )

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock.mock.calls[0]).toEqual([
      MUTATION,
      {
        attended: [participants[1].id, participants[2].id],
        attendedAudit: [
          {
            course_id: COURSE_ID,
            profile_id: participants[1].profile.id,
            type: 'ATTENDED',
            payload: {},
          },
          {
            course_id: COURSE_ID,
            profile_id: participants[2].profile.id,
            type: 'ATTENDED',
            payload: {},
          },
        ],
        notAttended: [participants[0].id],
        notAttendedAudit: [
          {
            course_id: COURSE_ID,
            profile_id: participants[0].profile.id,
            type: 'NOT_ATTENDED',
            payload: {},
          },
        ],
      },
    ])

    await waitForText('Modules page')

    expect(localStorage.getItem(`course-attendance-${COURSE_ID}`)).toBeNull()
  })

  it('confirms grading details if course is BILD', async () => {
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)

    const COURSE_ID = 10001
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      mutate: jest.fn(),
    })

    const client = {
      executeMutation: ({
        variables,
      }: {
        variables: SaveGradingDetailsMutationVariables
      }) => {
        const saved = variables.courseId === COURSE_ID

        return fromValue<{ data: SaveGradingDetailsMutation }>({
          data: {
            update_course_by_pk: saved
              ? {
                  id: COURSE_ID,
                  gradingConfirmed: true,
                }
              : null,
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id">
            <Route
              path="grading-details"
              element={
                <GradingDetailsProvider accreditedBy={Accreditors_Enum.Bild}>
                  <CourseAttendance />
                </GradingDetailsProvider>
              }
            />
          </Route>
          <Route path="/courses/:id/details" element={<CourseDetailsMock />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading-details`] }
    )

    await userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    await userEvent.click(
      screen.getByRole('button', { name: /continue to grading attendees/i })
    )

    await waitForText('course grading')

    expect(localStorage.getItem(`course-attendance-${COURSE_ID}`)).toBeNull()
  })
})

function CourseDetailsMock() {
  const [params] = useSearchParams()

  return params.get('tab') === CourseDetailsTabs.GRADING ? (
    <p>course grading</p>
  ) : null
}
