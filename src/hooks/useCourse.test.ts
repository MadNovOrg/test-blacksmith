import useSWR from 'swr'
import { renderHook } from '@testing-library/react-hooks'

import useCourse from '@app/hooks/useCourse'

import { buildCourse } from '@test/mock-data-utils'
import { chance } from '@test/index'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
}

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

describe('useCourse', () => {
  it('should return courseBegan equal false', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2030, 0, 1)
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    const { result } = renderHook(() => useCourse(chance.guid()))
    const { courseBegan } = result.current

    expect(courseBegan).toBeFalsy()
  })

  it('should return courseBegan equal true', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2020, 0, 1)
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    const { result } = renderHook(() => useCourse(chance.guid()))
    const { courseBegan } = result.current

    expect(courseBegan).toBeTruthy()
  })

  it('should return courseEnded equal false', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2030, 0, 2)
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    const { result } = renderHook(() => useCourse(chance.guid()))
    const { courseEnded } = result.current

    expect(courseEnded).toBeFalsy()
  })

  it('should return courseEnded equal true', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2020, 0, 2)
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    const { result } = renderHook(() => useCourse(chance.guid()))
    const { courseEnded } = result.current

    expect(courseEnded).toBeTruthy()
  })
})
