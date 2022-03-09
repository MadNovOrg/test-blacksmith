import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import useCourse from '@app/hooks/useCourse'
import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { CourseParticipants } from '.'

import { render, screen, within } from '@test/index'
import { LoadingStatus } from '@app/util'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useCourseParticipants')

const useCourseMock = useCourse as jest.MockedFunction<typeof useCourse>
const useCourseParticipantsMock = useCourseParticipants as jest.MockedFunction<
  typeof useCourseParticipants
>

describe('component: CourseParticipants', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('displays a spinner while loading a course and participants', () => {
    const COURSE_ID = 'course-id'

    useCourseMock.mockReturnValue({
      status: LoadingStatus.FETCHING,
    })

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.FETCHING,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
    expect(useCourseMock).toHaveBeenCalledWith(COURSE_ID)
  })

  it('displays a course overview', () => {
    const COURSE_ID = 'course-id'
    const course = buildCourse()

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.IDLE,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('course-fetching')).not.toBeInTheDocument()
    expect(screen.getByText(course.name)).toBeInTheDocument()
  })

  it('displays a spinner while loading course participants and course has loaded', () => {
    const COURSE_ID = 'course-id'

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: buildCourse(),
    })

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.FETCHING,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByTestId('course-participants-fetching')
    ).toBeInTheDocument()
  })

  it('displays a table if a course has participants', () => {
    const COURSE_ID = 'course-id'

    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: participants.length,
    })

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: buildCourse(),
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    participants.forEach(participant => {
      expect(screen.getByTestId(`course-participant-row-${participant.id}`))
    })

    const participantRow = screen.getByTestId(
      `course-participant-row-${participants[0].id}`
    )

    expect(
      within(participantRow).getByText(
        `${participants[0].profile.givenName} ${participants[0].profile.familyName}`
      )
    ).toBeInTheDocument()

    expect(
      within(participantRow).getByText(
        participants[0].profile.contactDetails?.find(
          contact => contact.type === 'email'
        )?.value ?? ''
      )
    )

    expect(
      within(participantRow).getByText(
        participants[0].profile.organizations[0].organization?.name ?? ''
      )
    ).toBeInTheDocument()
  })

  it('paginates course participants', () => {
    const COURSE_ID = 'course-id'
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
    })

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: buildCourse(),
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByTitle('Go to next page'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(2)
    expect(useCourseParticipantsMock.mock.calls[1]).toEqual([
      COURSE_ID,
      { limit: PER_PAGE, offset: PER_PAGE },
      'asc',
    ])
  })

  it('displays a message if a course does not have participants', () => {
    const COURSE_ID = 'course-id'

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [],
      total: 0,
    })

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: buildCourse(),
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText('No participants registered yet for this course.')
    ).toBeInTheDocument()
  })

  it('sorts descending by participants name', () => {
    const COURSE_ID = 'course-id'
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
    })

    useCourseMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: buildCourse(),
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/participants`]}>
        <Routes>
          <Route path="/:id/participants" element={<CourseParticipants />} />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText('Name'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(2)
    expect(useCourseParticipantsMock.mock.calls[1]).toEqual([
      COURSE_ID,
      { limit: PER_PAGE, offset: 0 },
      'desc',
    ])
  })
})
