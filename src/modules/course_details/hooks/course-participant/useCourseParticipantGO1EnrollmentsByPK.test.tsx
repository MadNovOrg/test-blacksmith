import { AnyVariables, useQuery, UseQueryResponse } from 'urql'

import { Go1EnrollmentStatus } from '@app/generated/graphql'

import { renderHook } from '@test/index'
import { chance } from '@test/index'

import useCourseParticipantGO1EnrollmentsByPK from './useCourseParticipantGO1EnrollmentsByPK'

vi.mock('urql')

describe('useCourseParticipantGO1EnrollmentsByPK', () => {
  const mockedUseQuery = vi.mocked(useQuery)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns loading when both queries are fetching', () => {
    mockedUseQuery
      .mockReturnValueOnce([
        { data: undefined, fetching: true, stale: false }, // courseParticipant query
      ] as unknown as UseQueryResponse<unknown, AnyVariables>)
      .mockReturnValueOnce([
        { data: undefined, fetching: true, stale: false }, // userGO1Enrollments query
      ] as unknown as UseQueryResponse<unknown, AnyVariables>)

    const { result } = renderHook(() =>
      useCourseParticipantGO1EnrollmentsByPK('123'),
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.courseParticipant).toBeNull()
    expect(result.current.blendedLearningEnrollments).toEqual([])
  })

  it('returns course participant and enrollments when both queries succeed', () => {
    const mockProfileId = chance.guid()

    mockedUseQuery
      .mockReturnValueOnce([
        {
          data: {
            courseParticipant: {
              id: '123',
              profile: { id: mockProfileId, fullName: 'Jane Doe' },
            },
          },
          fetching: false,
        },
      ] as unknown as UseQueryResponse<unknown, AnyVariables>)
      .mockReturnValueOnce([
        {
          data: {
            enrollments: {
              enrollments: [
                {
                  id: 1,
                  status: Go1EnrollmentStatus.Completed,
                  learningObject: {
                    id: 1001,
                    title: 'Blended Learning 2024',
                  },
                },
              ],
            },
          },
          fetching: false,
        },
      ] as unknown as UseQueryResponse<unknown, AnyVariables>)

    const { result } = renderHook(() =>
      useCourseParticipantGO1EnrollmentsByPK(mockProfileId),
    )

    expect(result.current.loading).toBe(false)
    expect(result.current.courseParticipant).toEqual({
      id: '123',
      profile: { id: mockProfileId, fullName: 'Jane Doe' },
    })
    expect(result.current.blendedLearningEnrollments).toEqual([
      {
        id: 1,
        status: Go1EnrollmentStatus.Completed,
        learningObject: { id: 1001, title: 'Blended Learning 2024' },
      },
    ])
  })
})
