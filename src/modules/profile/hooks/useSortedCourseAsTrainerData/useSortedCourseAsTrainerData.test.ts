import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { act, renderHook } from '@test/index'

import { useSortedCourseAsTrainerData } from './useSortedCourseAsTrainerData'

describe('useSortedCourseAsTrainerData', () => {
  const mockProfile = {
    courseAsTrainer: [
      {
        course: { dates: { aggregate: { start: { date: '2024-05-10' } } } },
      },
      {
        course: { dates: { aggregate: { start: { date: '2024-05-15' } } } },
      },
    ],
  }

  it('should initialize with default sort order and sorted courses', () => {
    const { result } = renderHook(() =>
      useSortedCourseAsTrainerData({
        profile: mockProfile as unknown as GetProfileDetailsQuery['profile'],
      }),
    )

    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.sortedCourses).toEqual([
      mockProfile.courseAsTrainer[1],
      mockProfile.courseAsTrainer[0],
    ])
  })

  it('should toggle sort order and update sorted courses', () => {
    const { result } = renderHook(() =>
      useSortedCourseAsTrainerData({
        profile: mockProfile as unknown as GetProfileDetailsQuery['profile'],
      }),
    )

    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('asc')
    expect(result.current.sortedCourses[0]).toEqual(
      mockProfile.courseAsTrainer[0],
    )

    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.sortedCourses[0]).toEqual(
      mockProfile.courseAsTrainer[1],
    )
  })
})
