import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { VenueSelector } from '@app/components/VenueSelector'
import useCourse from '@app/hooks/useCourse'
import { CourseType, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { EditCourse } from '.'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(),
}))

const useCourseMocked = jest.mocked(useCourse)
const VenueSelectorMocked = jest.mocked(VenueSelector)

describe('page: EditCourse', () => {
  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
  })

  it('displays spinner while loading for the course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('edit-course-fetching')).toBeInTheDocument()
  })

  it('displays a message if there is no course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: undefined,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("displays an error message if can't load the course to edit", () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.ERROR,
      data: undefined,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(
      screen.getByText('There was an error loading the course')
    ).toBeInTheDocument()
  })

  it("doesn't allow unauthorized users to edit open course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>,
      { auth: { activeRole: RoleName.TRAINER } }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow unauthorized users to edit closed course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>,
      { auth: { activeRole: RoleName.TRAINER } }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow unauthorized users to edit indirect course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: CourseType.INDIRECT,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: openCourse,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/edit/1']}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </MemoryRouter>,
      { auth: { activeRole: RoleName.TT_OPS } }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})
