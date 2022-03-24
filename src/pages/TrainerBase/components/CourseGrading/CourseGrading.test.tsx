import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import useCourseModules from '@app/hooks/useCourseModules'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useFetcher } from '@app/hooks/use-fetcher'

import { CourseGrading } from './'

import { render, screen, within, userEvent, waitForText } from '@test/index'
import { LoadingStatus } from '@app/util'
import {
  buildCourse,
  buildCourseModule,
  buildParticipant,
} from '@test/mock-data-utils'
import { MUTATION } from '@app/queries/grading/save-course-grading'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useCourseModules')
jest.mock('@app/hooks/useCourseParticipants')
jest.mock('@app/hooks/use-fetcher')

const useCourseMocked = jest.mocked(useCourse)
const useCourseModulesMocked = jest.mocked(useCourseModules)
const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)
const useFetcherMock = jest.mocked(useFetcher)

describe('page: CourseGrading', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays spinner while loading course grading data', () => {
    const COURSE_ID = 'course-id'

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
  })

  it('displays course name, course participants who attended and covered course modules', () => {
    const COURSE_ID = 'course-id'

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it("doesn't display already graded participants", () => {
    const COURSE_ID = 'course-id'

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true, graded: true },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it('displays selected participants from query param', () => {
    const COURSE_ID = 'course-id'

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter
        initialEntries={[
          `/${COURSE_ID}/grading?participants=${courseParticipants[0].id},${courseParticipants[1].id}`,
        ]}
      >
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    const selectedParticipants = [courseParticipants[0], courseParticipants[1]]
    const notSelectedParticipant = courseParticipants[2]

    selectedParticipants.forEach(participant => {
      expect(
        screen.getByText(`${participant.profile.fullName}`)
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByText(`${notSelectedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('2 attendee(s)')).toBeInTheDocument()
  })

  it('displays confirmation modal when clicked on submit button', () => {
    const COURSE_ID = 'course-id'

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText('Submit final grade'))

    expect(screen.getByText('Grading confirmation')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByText('Confirm')).toBeVisible()
  })

  it('closes modal when saving is not confirmed', () => {
    const COURSE_ID = 'course-id'

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText('Submit final grade'))

    userEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByText('Grading confirmation')).not.toBeVisible()
  })

  it('saves grades for participants when an intent for saving is confirmed', async () => {
    const COURSE_ID = 'course-id'
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockResolvedValue({
      saveGrades: { affectedRows: 2 },
      saveParticipantsGraded: { affectedRows: 2 },
    })

    const course = buildCourse()
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    useCourseModulesMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseModules,
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: courseParticipants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading`]}>
        <Routes>
          <Route path="/:id/grading" element={<CourseGrading />} />
          <Route
            path="/trainer-base/course/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </MemoryRouter>
    )

    userEvent.type(
      screen.getByPlaceholderText('Any notes attendee(s) (optional)'),
      'Feedback'
    )

    userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    userEvent.click(screen.getByText('Submit final grade'))
    userEvent.click(screen.getByText('Confirm'))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(MUTATION, {
      participantGrades: [
        {
          course_participant_id: courseParticipants[1].id,
          module_id: courseModules[0].module.id,
          grade: 'INCOMPLETE',
          feedback: 'Feedback',
        },
        {
          course_participant_id: courseParticipants[1].id,
          module_id: courseModules[1].module.id,
          grade: 'PASS',
          feedback: 'Feedback',
        },
      ],
      participantIds: [courseParticipants[1].id],
    })

    await waitForText('Course details')
  })
})
