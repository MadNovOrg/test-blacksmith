import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import useSWR from 'swr'

import { QUERY } from '@app/queries/courses/get-trainer-courses'
import { Course } from '@app/types'

import {
  render,
  screen,
  within,
  chance,
  userEvent,
  waitForCalls,
} from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { MyCourses } from './MyCourses'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = (data?: { course?: Partial<Course>[] }) => {
  return {
    data,
    mutate: jest.fn(),
    isValidating: false,
  }
}

const _render = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('trainers-pages/MyCourses', () => {
  it('renders loading', async () => {
    const where = {}
    const orderBy = { name: 'asc' }
    useSWRMock.mockReturnValue(useSWRMockDefaults())

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)
    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByTestId('fetching-courses')).toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
  })

  it('renders no results', async () => {
    const where = {}
    const orderBy = { name: 'asc' }
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: [] }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)
    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByTestId('TableNoRows')).toBeInTheDocument()
    expect(
      within(tbl).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
  })

  it('renders courses', async () => {
    const where = {}
    const orderBy = { name: 'asc' }

    const courses = [buildCourse(), buildCourse(), buildCourse()]
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: courses }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)
    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )

    const tbl = screen.getByTestId('courses-table')

    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(courses.length)
    expect(
      within(tbl).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
  })

  it('filters by search', async () => {
    const keyword = chance.word()
    const where = { name: { _ilike: `%${keyword}%` } }
    const orderBy = { name: 'asc' }

    const courses = [buildCourse(), buildCourse(), buildCourse()]
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: courses }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)

    const search = screen.getByTestId('FilterSearch-Input')
    userEvent.type(search, keyword)

    await waitForCalls(useSWRMock, 2) // wait for update

    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )
  })

  it('filters by level', async () => {
    const where = { level: { _in: ['LEVEL_1'] } }
    const orderBy = { name: 'asc' }

    const courses = [buildCourse(), buildCourse(), buildCourse()]
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: courses }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)

    const levels = screen.getByTestId('FilterCourseLevel')
    const [level] = within(levels).getAllByTestId('FilterCourseLevel-option')

    userEvent.click(level)

    await waitForCalls(useSWRMock, 2) // wait for update

    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )
  })

  it('filters by type', async () => {
    const where = { type: { _in: ['OPEN'] } }
    const orderBy = { name: 'asc' }

    const courses = [buildCourse(), buildCourse(), buildCourse()]
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: courses }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)

    const types = screen.getByTestId('FilterCourseType')
    const [type] = within(types).getAllByTestId('FilterCourseType-option')

    userEvent.click(type)

    await waitForCalls(useSWRMock, 2) // wait for update

    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )
  })

  it('filters by status', async () => {
    const where = { status: { _in: ['PENDING'] } }
    const orderBy = { name: 'asc' }

    const courses = [buildCourse(), buildCourse(), buildCourse()]
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: courses }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)

    const statuses = screen.getByTestId('FilterCourseStatus')
    const [status] = within(statuses).getAllByTestId(
      'FilterCourseStatus-option'
    )

    userEvent.click(status)

    await waitForCalls(useSWRMock, 2) // wait for update

    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )
  })
})
