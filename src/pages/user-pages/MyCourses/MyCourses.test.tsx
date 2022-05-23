import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import useSWR from 'swr'

import { QUERY } from '@app/queries/user-queries/get-user-courses'
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

describe('user-pages/MyCourses', () => {
  it('renders loading', async () => {
    const orderBy = { name: 'asc' }
    const where = { participants: { profile_id: { _eq: expect.any(String) } } }
    useSWRMock.mockReturnValue(useSWRMockDefaults())

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)
    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByRole('progressbar')).toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
  })

  it('renders no results', async () => {
    const orderBy = { name: 'asc' }
    const where = { participants: { profile_id: { _eq: expect.any(String) } } }
    useSWRMock.mockReturnValue(useSWRMockDefaults({ course: [] }))

    _render(<MyCourses />)

    expect(useSWRMock).toBeCalledTimes(1)
    expect(useSWRMock).toBeCalledWith(
      [expect.stringContaining(QUERY), { orderBy, where }],
      expect.anything()
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByTestId('TableNoRows')).toBeInTheDocument()
    expect(within(tbl).queryByRole('progressbar')).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
  })

  it('renders courses', async () => {
    const orderBy = { name: 'asc' }
    const where = { participants: { profile_id: { _eq: expect.any(String) } } }

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
    expect(within(tbl).queryByRole('progressbar')).not.toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
  })

  it('filters by search', async () => {
    const orderBy = { name: 'asc' }

    const keyword = chance.word()
    const where = {
      participants: { profile_id: { _eq: expect.any(String) } },
      name: { _ilike: `%${keyword}%` },
    }

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
    const orderBy = { name: 'asc' }

    const where = {
      participants: { profile_id: { _eq: expect.any(String) } },
      level: { _in: ['LEVEL_1'] },
    }

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
    const orderBy = { name: 'asc' }

    const where = {
      participants: { profile_id: { _eq: expect.any(String) } },
      type: { _in: ['OPEN'] },
    }

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
})
