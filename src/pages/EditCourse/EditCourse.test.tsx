import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

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

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByTestId('edit-course-fetching')).toBeInTheDocument()
  })

  it('displays a message if there is no course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: undefined,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] }
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

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] }
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

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] }
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

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] }
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

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_OPS } },
      { initialEntries: ['/courses/edit/1'] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})
