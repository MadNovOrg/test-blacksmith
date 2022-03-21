import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import useCourseModules from '@app/hooks/useCourseModules'
import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { CourseGrading } from './'

import { render, screen, within } from '@test/index'
import { LoadingStatus } from '@app/util'
import {
  buildCourse,
  buildCourseModule,
  buildParticipant,
} from '@test/mock-data-utils'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useCourseModules')
jest.mock('@app/hooks/useCourseParticipants')

const useCourseMocked = jest.mocked(useCourse)
const useCourseModulesMocked = jest.mocked(useCourseModules)
const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)

describe('page: CourseGrading', () => {
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
      screen.getByText(
        `${attendedParticipant.profile.givenName} ${attendedParticipant.profile.familyName}`
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        `${notAttendedParticipant.profile.givenName} ${notAttendedParticipant.profile.familyName}`
      )
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
        screen.getByText(
          `${participant.profile.givenName} ${participant.profile.familyName}`
        )
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByText(
        `${notSelectedParticipant.profile.givenName} ${notSelectedParticipant.profile.familyName}`
      )
    ).not.toBeInTheDocument()

    expect(screen.getByText('2 attendee(s)')).toBeInTheDocument()
  })

  it.todo('stores modules selection when changed')
  it.todo('displays modules selection from local storage if previously edited')
  it.todo('saves grades for participants')
})
