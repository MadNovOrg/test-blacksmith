import { renderHook } from '@testing-library/react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Certificate_Status_Enum,
  Course_Level_Enum,
  GetProfilesWithCertificationsQuery,
} from '@app/generated/graphql'

import { chance } from '@test/index'

import {
  GET_PROFILES_WITH_CERTIFICATIONS,
  useOrganisationProfilesByCertificateLevel,
} from './useOrganisationProfielsByCertificateLevel'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useSearchParams: vi
    .fn()
    .mockReturnValue([
      new URLSearchParams({ status: Certificate_Status_Enum.Active }),
      vi.fn(),
    ]),
}))

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      canViewAllOrganizations: vi.fn().mockReturnValue(true),
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

describe(useOrganisationProfilesByCertificateLevel.name, () => {
  it('should return object with correct structure', () => {
    const {
      result: { current },
    } = renderHook(() => useOrganisationProfilesByCertificateLevel())

    expect(current.profilesByLevel.size).toBe(0)

    expect(current).toEqual({
      profilesByLevel: new Map(),
      fetching: false,
    })
  })
  it('should return the correct fetching state', () => {
    const profileId = chance.guid()
    const certificateLevel = Course_Level_Enum.Advanced

    const profiles: GetProfilesWithCertificationsQuery['profiles'] = [
      {
        id: profileId,
        certificates: [
          {
            courseLevel: certificateLevel,
            expiryDate: '2021-01-01',
            status: Certificate_Status_Enum.Active,
          },
        ],
      },
    ]

    useQueryMock.mockReturnValue([
      {
        data: {
          profiles,
        } as GetProfilesWithCertificationsQuery,
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const {
      result: { current },
    } = renderHook(() => useOrganisationProfilesByCertificateLevel())

    expect(current).toEqual({
      fetching: false,
      profilesByLevel: new Map([[certificateLevel, profiles]]),
    })
  })
  it('should call useQuery with correct variables', () => {
    const profileId = chance.guid()
    const certificateFilter = [Certificate_Status_Enum.Active]
    useAuthMock.mockReturnValue({
      acl: {
        canViewAllOrganizations: vi.fn().mockReturnValue(false),
      },
      profile: {
        id: profileId,
      },
    } as unknown as ReturnType<typeof useAuth>)

    renderHook(() => useOrganisationProfilesByCertificateLevel())

    expect(useQueryMock).toHaveBeenCalledWith({
      query: GET_PROFILES_WITH_CERTIFICATIONS,
      requestPolicy: 'cache-first',
      variables: {
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
        whereProfileCertificates: {
          _and: [
            {
              status: certificateFilter?.length
                ? { _in: certificateFilter }
                : { _neq: Certificate_Status_Enum.Expired },
              isRevoked: { _eq: false },
            },
            {
              _or: [{ grade: { _is_null: true } }, { grade: { _neq: 'FAIL' } }],
            },
            {
              _or: [
                { participant: { completed_evaluation: { _eq: true } } },
                { legacyCourseCode: { _is_null: false, _neq: '' } },
              ],
            },
          ],
        },
      },
    })
  })
})
