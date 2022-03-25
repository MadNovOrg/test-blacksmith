import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { CreateCourse } from '.'

import { render, within, screen } from '@test/index'

describe('page: CreateCourse', () => {
  it("doesn't mark any step as done if on course details page", () => {
    render(
      <MemoryRouter initialEntries={[`/trainer-base/course/new`]}>
        <Routes>
          <Route path="/trainer-base/course/new" element={<CreateCourse />}>
            <Route index element={<h1>Create course form page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).getByText('1')).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('marks course details page as done if on assign trainers page', () => {
    render(
      <MemoryRouter
        initialEntries={[`/trainer-base/course/new/assign-trainers`]}
      >
        <Routes>
          <Route path="/trainer-base/course/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(
      within(attendanceNavItem).getByTestId('CheckIcon')
    ).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })
})
