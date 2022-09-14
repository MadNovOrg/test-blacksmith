import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { CourseType, RoleName } from '@app/types'

import { render, within, screen } from '@test/index'

import { StepsEnum } from './types'

import { CreateCourse } from '.'

describe('page: CreateCourse', () => {
  it("doesn't mark any step as done if on course details page", () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route index element={<h1>Create course form page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).getByText('1')).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it("doesn't mark course details page as done if on assign trainers page but course details page wasn't marked as complete", () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new/assign-trainers`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).queryByTestId('CheckIcon')).toBe(null)
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('marks course details page as done if on assign trainers page and details page was marked as complete', () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new/assign-trainers`]}>
        <Routes>
          <Route
            path="/courses/new"
            element={
              <CreateCourse
                initialContextValue={{
                  completedSteps: [StepsEnum.COURSE_DETAILS],
                }}
              />
            }
          >
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(
      within(attendanceNavItem).getByTestId('CheckIcon')
    ).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('renders correct title when creating open course', () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new?type=${CourseType.OPEN}`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    expect(screen.getByText('Open course creation')).toBeInTheDocument()
  })

  it('renders correct title when creating closed course', () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new?type=${CourseType.CLOSED}`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    expect(screen.getByText('Closed course creation')).toBeInTheDocument()
  })

  it('renders correct title when creating indirect course', () => {
    render(
      <MemoryRouter
        initialEntries={[`/courses/new?type=${CourseType.INDIRECT}`]}
      >
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    expect(screen.getByText('Course creation')).toBeInTheDocument()
  })

  it('displays correct steps for the indirect course', () => {
    render(
      <MemoryRouter
        initialEntries={[`/courses/new?type=${CourseType.INDIRECT}`]}
      >
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const nav = screen.getByTestId('create-course-nav')

    expect(within(nav).queryByText('Assign trainer(s)')).not.toBeInTheDocument()
  })

  it("doesn't allow non-authorized users to create open course", () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new?type=${CourseType.OPEN}`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow non-authorized users to create closed course", () => {
    render(
      <MemoryRouter initialEntries={[`/courses/new?type=${CourseType.CLOSED}`]}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow non-authorized users to create open course", () => {
    render(
      <MemoryRouter
        initialEntries={[`/courses/new?type=${CourseType.INDIRECT}`]}
      >
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})
