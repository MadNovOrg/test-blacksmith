import userEvent from '@testing-library/user-event'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Accreditors_Enum } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { LoadingStatus } from '@app/util'

import { render, screen, within } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseGradingDetails } from '.'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

describe('page: CourseGradingDetails', () => {
  it('displays a spinner while the course is loading', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: undefined,
      status: LoadingStatus.FETCHING,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    expect(screen.getByTestId('course-fetching')).toBeInTheDocument()
  })

  it('displays an error message if there is an issue loading the course', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: undefined,
      status: LoadingStatus.ERROR,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    expect(
      screen.getByText('There was an error loading the course')
    ).toBeInTheDocument()
  })

  it('displays course name', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
  })

  it('links back to the course manage page', async () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
        <Route
          path={`/courses/${course.id}/details`}
          element={<p>Course participants page</p>}
        />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    await userEvent.click(screen.getByText('Back to course details'))

    expect(screen.getByText('Course participants page')).toBeInTheDocument()
  })

  it('displays grading subnavigation', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    const subnav = screen.getByTestId('course-grading-details-nav')

    expect(within(subnav).getByText('Grading clearance')).toBeInTheDocument()
    expect(
      within(subnav).getByText('Modules and Techniques')
    ).toBeInTheDocument()
  })

  it("doesn't mark any step as completed if on attendance page", () => {
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
      },
    })

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    const subnav = screen.getByTestId('course-grading-details-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).getByText('1')).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('marks attendance step as completed modules page', () => {
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
      },
    })

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />}>
          <Route path="modules" element={<h1>Modules</h1>} />
        </Route>
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details/modules`] }
    )

    const subnav = screen.getByTestId('course-grading-details-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(
      within(attendanceNavItem).getByTestId('CheckIcon')
    ).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it("doesn't render steps for BILD course", () => {
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
      },
    })

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    render(
      <Routes>
        <Route path="/:id/grading-details" element={<CourseGradingDetails />}>
          <Route path="modules" element={<h1>Modules</h1>} />
        </Route>
      </Routes>,
      {},
      { initialEntries: [`/${course.id}/grading-details`] }
    )

    expect(
      screen.queryByTestId('course-grading-details-nav')
    ).not.toBeInTheDocument()
  })
})
