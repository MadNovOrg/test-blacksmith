import { useMutation, useQuery } from 'urql'

import {
  Course_Level_Enum,
  GetProfileDetailsQuery,
} from '@app/generated/graphql'

import { chance, renderHook } from '@test/index'

import useProfile, { matchRequiredCertificates } from './useProfile'

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      isTTAdmin: vi.fn().mockReturnValue(false),
    },
  }),
}))

vi.mock('urql', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn().mockReturnValue([{}, vi.fn()]),
  gql: vi.fn(),
}))

const useQueryMock = vi.mocked(useQuery)
const useMutationMock = vi.mocked(useMutation)

describe(useProfile.name, () => {
  it('should call useProfile', () => {
    const profileId = chance.guid()
    const courseId = chance.guid()
    useQueryMock.mockReturnValue([
      {
        data: {
          certificates: [{}],
          profile: {
            id: profileId,
          },
          upcomingCourses: [{}],
        } as GetProfileDetailsQuery,
        error: undefined,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    renderHook(() =>
      useProfile(profileId, courseId, 'orgId', true, false, true),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(1)
  })
  it('should return correct data structure', () => {
    const profileId = chance.guid()
    const courseId = chance.guid()
    const mockData = {
      certifications: [{}],
      archive: expect.any(Function),
      getProfileError: undefined,
      go1Licenses: undefined,
      missingCertifications: [],
      profile: {
        id: profileId,
      },
      upcomingCourses: [{}],
      status: expect.any(String),
      updateAvatar: expect.any(Function),
    } as unknown as ReturnType<typeof useProfile>

    useQueryMock.mockReturnValue([
      {
        data: { certificates: [{}], ...mockData },
        error: undefined,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfile(profileId, courseId, 'orgId', true, false, true),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(result.current).toEqual(mockData)
  })
  it('should check missing certifications based on upcoming course levels', () => {
    const profileId = chance.guid()
    const courseId = 123
    const courseLevel = Course_Level_Enum.Advanced

    const mockData = {
      profile: {
        id: profileId,
      },
      upcomingCourses: [
        {
          level: courseLevel,
          residingCountry: 'GB-ENG',
          id: courseId,
          course_code: '123',
        },
      ] as GetProfileDetailsQuery['upcomingCourses'],
    } as unknown as ReturnType<typeof useProfile>

    useQueryMock.mockReturnValue([
      {
        data: { certificates: [{}], ...mockData },
        error: undefined,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfile(profileId, String(courseId), 'orgId', true, false, true),
    )

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(result.current.missingCertifications).toEqual([
      {
        courseId: courseId,
        courseCode: '123',
        requiredCertificate: matchRequiredCertificates({
          level: courseLevel,
          isUKCountry: true,
        }),
      },
    ])
  })
  it.each([
    {
      input: {
        level: Course_Level_Enum.Advanced,
        reaccreditation: false,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.Level_2],
    },
    {
      input: {
        level: Course_Level_Enum.AdvancedTrainer,
        reaccreditation: false,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.IntermediateTrainer],
    },
    {
      input: {
        level: Course_Level_Enum.AdvancedTrainer,
        reaccreditation: true,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.AdvancedTrainer],
    },
    {
      input: {
        level: Course_Level_Enum.BildAdvancedTrainer,
        reaccreditation: false,
        isUKCountry: true,
      },
      expected: [
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.BildIntermediateTrainer,
      ],
    },
    {
      input: {
        level: Course_Level_Enum.BildIntermediateTrainer,
        reaccreditation: true,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.BildIntermediateTrainer],
    },
    {
      input: {
        level: Course_Level_Enum.IntermediateTrainer,
        reaccreditation: false,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2],
    },
    {
      input: {
        level: Course_Level_Enum.IntermediateTrainer,
        reaccreditation: true,
        isUKCountry: true,
      },
      expected: [Course_Level_Enum.IntermediateTrainer],
    },
  ])('should return $expected for input $input', ({ input, expected }) => {
    const result = matchRequiredCertificates(input)
    expect(result).toEqual(expected)
  })
  it('should return empty array if no upcoming courses', () => {
    const profileId = chance.guid()
    const courseId = chance.guid()
    const mockData = {
      profile: {
        id: profileId,
      },
      upcomingCourses: [],
    } as unknown as ReturnType<typeof useProfile>

    useQueryMock.mockReturnValue([
      {
        data: { certificates: [{}], ...mockData },
        error: undefined,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfile(profileId, courseId, 'orgId', true, false, true),
    )

    expect(result.current.missingCertifications).toEqual([])
  })
  it.each([
    Course_Level_Enum.Level_1,
    Course_Level_Enum.FoundationTrainer,
    Course_Level_Enum.FoundationTrainerPlus,
    Course_Level_Enum.Level_1Np,
    Course_Level_Enum.Level_1Bs,
    Course_Level_Enum.Level_2,
  ])(
    'should return empty array for levels that do not require certifications -- %s',
    level => {
      const profileId = chance.guid()
      const courseId = 123

      const mockData = {
        profile: {
          id: profileId,
        },
        upcomingCourses: [
          {
            level,
            residingCountry: 'GB-ENG',
            id: courseId,
            course_code: '123',
          },
        ] as GetProfileDetailsQuery['upcomingCourses'],
      } as unknown as ReturnType<typeof useProfile>

      useQueryMock.mockReturnValue([
        {
          data: { certificates: [{}], ...mockData },
          error: undefined,
          fetching: false,
          stale: false,
        },
        vi.fn(),
      ])

      const { result } = renderHook(() =>
        useProfile(profileId, String(courseId), 'orgId', true, false, true),
      )

      expect(result.current.missingCertifications).toEqual([])
    },
  )
  it('should call updateAvatar and archive mutations', () => {
    const profileId = chance.guid()
    const courseId = chance.guid()
    const mockData = {
      profile: {
        id: profileId,
      },
      upcomingCourses: [{}],
    } as unknown as ReturnType<typeof useProfile>

    useQueryMock.mockReturnValue([
      {
        data: { certificates: [{}], ...mockData },
        error: undefined,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfile(profileId, courseId, 'orgId', true, false, true),
    )

    result.current.updateAvatar({
      profileId,
      avatar: [1],
    })

    result.current.archive()

    expect(useMutationMock).toHaveBeenCalledTimes(2)
  })
})
