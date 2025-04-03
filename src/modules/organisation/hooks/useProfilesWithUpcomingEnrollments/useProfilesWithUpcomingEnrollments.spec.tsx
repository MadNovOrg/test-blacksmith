import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'

import { chance, renderHook } from '@test/index'

import {
  GET_PROFILES_WITH_UPCOMING_ENROLLMENTS,
  useProfilesWithUpcomingEnrollments,
} from './useProfilesWithUpcomingEnrollments'

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      isInternalUser: vi.fn().mockReturnValue(false),
      isOrgAdmin: vi.fn().mockReturnValue(false),
    },
  }),
}))

vi.mock('urql', async () => ({
  ...(await vi.importActual('urql')),
  gql: vi.fn(),
  useQuery: vi.fn().mockReturnValue([
    {
      fetching: false,
      data: {
        profile: [],
      },
    },
  ]),
}))

const useQueryMock = vi.mocked(useQuery)
const useAuthMock = vi.mocked(useAuth)

describe(useProfilesWithUpcomingEnrollments.name, () => {
  it('should call useQuery with correct variables for internalUser', () => {
    const ids = ['1', '2']
    const orgId = chance.guid()
    const profileId = chance.guid()

    useAuthMock.mockReturnValueOnce({
      acl: {
        isInternalUser: vi.fn().mockReturnValue(false),
        isOrgAdmin: vi.fn().mockReturnValue(true),
      },
      profile: { id: profileId },
    } as unknown as ReturnType<typeof useAuth>)

    renderHook(() => useProfilesWithUpcomingEnrollments({ ids, orgId }))

    expect(useQueryMock).toHaveBeenCalledWith({
      query: GET_PROFILES_WITH_UPCOMING_ENROLLMENTS,
      variables: {
        enrollmentsCondition: {
          _or: [
            { orgId: { _eq: orgId } },
            {
              course: {
                participants: {
                  profile: {
                    organizations: {
                      organization: {
                        _or: [
                          {
                            members: {
                              _and: [
                                { profile_id: { _eq: profileId } },
                                { isAdmin: { _eq: true } },
                              ],
                            },
                          },
                          {
                            main_organisation: {
                              members: {
                                _and: [
                                  { profile_id: { _eq: profileId } },
                                  { isAdmin: { _eq: true } },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        ids,
      },
    })
  })
  it('should call useQuery with correct variables for !isInternalUser && !profile && !isOrgAdmin', () => {
    useAuthMock.mockReturnValueOnce({
      acl: {
        isInternalUser: vi.fn().mockReturnValue(false),
        isOrgAdmin: vi.fn().mockReturnValue(false),
      },
      profile: { id: '1' },
    } as unknown as ReturnType<typeof useAuth>)
    const ids = ['1', '2']
    const orgId = chance.guid()
    renderHook(() => useProfilesWithUpcomingEnrollments({ ids, orgId }))

    expect(useQueryMock).toHaveBeenCalledWith({
      query: GET_PROFILES_WITH_UPCOMING_ENROLLMENTS,
      variables: { enrollmentsCondition: {}, ids },
    })
  })
})
