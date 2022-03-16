import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import useCourse from '@app/hooks/useCourse'

import { CourseGradingDetails } from '.'

import { render, screen, within } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'
import { LoadingStatus } from '@app/util'

jest.mock('@app/hooks/useCourse')

const useCourseMocked = jest.mocked(useCourse)

describe('page: CourseGradingDetails', () => {
  it('displays a spinner while the course is loading', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: undefined,
      status: LoadingStatus.FETCHING,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
  })

  it('displays an error message if there is an issue loading the course', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: undefined,
      status: LoadingStatus.ERROR,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText('There was an error loading the course')
    ).toBeInTheDocument()
  })

  it('displays course name', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
  })

  it('links back to the course manage page', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
          <Route
            path={`/trainer-base/course/${course.id}/details`}
            element={<p>Course participants page</p>}
          />
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText('Back to course details'))

    expect(screen.getByText('Course participants page')).toBeInTheDocument()
  })

  it('displays grading subnavigation', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    const subnav = screen.getByTestId('course-grading-details-nav')

    expect(within(subnav).getByText('Attendance')).toBeInTheDocument()
    expect(within(subnav).getByText('Modules and holds')).toBeInTheDocument()
  })

  it("doesn't mark any step as completed if on attendance page", () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseGradingDetails />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    const subnav = screen.getByTestId('course-grading-details-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).getByText('1')).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('marks attendance step as completed modules page', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <MemoryRouter initialEntries={[`/${course.id}/grading-details/modules`]}>
        <Routes>
          <Route path="/:id/grading-details" element={<CourseGradingDetails />}>
            <Route path="modules" element={<h1>Modules</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    const subnav = screen.getByTestId('course-grading-details-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(
      within(attendanceNavItem).getByTestId('CheckIcon')
    ).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })
})
