import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { act, renderHook } from '@test/index'

import { useSortedCoursesTableData } from './useSortedCoursesTableData'
describe('useSortedCoursesTableData', () => {
  const mockProfile = {
    courses: [
      {
        __typename: 'course_participant',
        course: { start: { aggregate: { date: { start: '2024-05-15' } } } },
      },
      {
        __typename: 'course_participant',
        course: { start: { aggregate: { date: { start: '2024-05-10' } } } },
      },
    ],
    participantAudits: [
      {
        __typename: 'course_participant_audit',
        course: { dates: { aggregate: { start: { date: '2024-05-05' } } } },
      },
      {
        __typename: 'course_participant_audit',
        course: { dates: { aggregate: { start: { date: '2024-05-20' } } } },
      },
    ],
  }

  it('should initialize with default sort order and sorted data', () => {
    const { result } = renderHook(() =>
      useSortedCoursesTableData({
        profile: mockProfile as unknown as GetProfileDetailsQuery['profile'],
      }),
    )

    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.sortedData).toEqual([
      mockProfile.participantAudits[1],
      mockProfile.courses[0],
      mockProfile.courses[1],
      mockProfile.participantAudits[0],
    ])
  })

  it('should toggle sort order and update sorted data', () => {
    const { result } = renderHook(() =>
      useSortedCoursesTableData({
        profile: mockProfile as unknown as GetProfileDetailsQuery['profile'],
      }),
    )

    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('asc')
    expect(result.current.sortedData[0]).toEqual(
      mockProfile.participantAudits[0],
    )

    // Toggle sort order again
    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.sortedData[0]).toEqual(
      mockProfile.participantAudits[1],
    )
  })
})
