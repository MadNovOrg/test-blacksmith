import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import { GetProfilesWithOrganisationsQuery } from '@app/generated/graphql'

import { chance, renderHook } from '@test/index'

import {
  GET_PROFILES_WITH_ORGANISATIONS,
  useProfilesWithOrganisations,
} from './useProfilesWithOrganisations'

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      canViewAllOrganizations: vi.fn().mockReturnValue(false),
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
        profiles: [],
      },
    },
  ]),
}))

const useQueryMock = vi.mocked(useQuery)
const useAuthMock = vi.mocked(useAuth)

describe(useProfilesWithOrganisations.name, () => {
  it('should return object of correct structure', () => {
    useAuthMock.mockReturnValueOnce({
      acl: {
        canViewAllOrganizations: vi.fn().mockReturnValue(true),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const {
      result: { current },
    } = renderHook(() => useProfilesWithOrganisations({ ids: [] }))

    expect(current.profileWithOrganisations.size).toBe(0)
    expect(current).toEqual({
      profileWithOrganisations: new Map([]),
      fetching: false,
    })
  })
  it('should call useQuery with correct variables', () => {
    useAuthMock.mockReturnValueOnce({
      acl: {
        canViewAllOrganizations: vi.fn().mockReturnValue(true),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const ids = ['1', '2']

    renderHook(() => useProfilesWithOrganisations({ ids }))

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: GET_PROFILES_WITH_ORGANISATIONS,
        variables: {
          ids,
          whereOrganizations: {},
        },
      }),
    )
  })
  it('should return profilesWithprganisations object of correct structure', () => {
    const profileId = chance.guid()
    const profiles = [
      {
        id: profileId,
        organizations: [
          {
            id: chance.guid(),
            position: 'position',
            organization: {
              id: chance.guid(),
              name: 'name',
            },
          },
        ],
      },
    ] as GetProfilesWithOrganisationsQuery['profiles']
    useQueryMock.mockReturnValue([
      {
        fetching: false,
        stale: false,
        data: {
          profiles,
        } as GetProfilesWithOrganisationsQuery,
      },
      vi.fn(),
    ])

    const {
      result: { current },
    } = renderHook(() => useProfilesWithOrganisations({ ids: [] }))

    expect(current.profileWithOrganisations.size).toBe(profiles.length)
    expect(current).toEqual({
      fetching: false,
      profileWithOrganisations: new Map([[profileId, profiles[0]]]),
    })
  })
  it('calls useQuery wit specific variables when user can not view all orgs', () => {
    const profileId = chance.guid()
    useAuthMock.mockReturnValueOnce({
      acl: {
        canViewAllOrganizations: vi.fn().mockReturnValue(false),
      },
      profile: {
        id: profileId,
      },
    } as unknown as ReturnType<typeof useAuth>)

    const ids = ['1', '2']
    renderHook(() => useProfilesWithOrganisations({ ids }))

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        query: GET_PROFILES_WITH_ORGANISATIONS,
        variables: {
          ids,
          whereOrganizations: {
            _or: [
              {
                members: {
                  _and: [
                    {
                      profile_id: {
                        _eq: profileId,
                      },
                    },
                    { isAdmin: { _eq: true } },
                  ],
                },
              },
              {
                main_organisation: {
                  members: {
                    _and: [
                      {
                        profile_id: {
                          _eq: profileId,
                        },
                      },
                      { isAdmin: { _eq: true } },
                    ],
                  },
                },
              },
            ],
          },
        },
      }),
    )
  })
})
