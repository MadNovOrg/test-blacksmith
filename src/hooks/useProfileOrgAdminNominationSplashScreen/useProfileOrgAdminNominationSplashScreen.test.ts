import { useQuery, useMutation } from 'urql'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useAuth } from '@app/context/auth'
import { Splash_Screens_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { renderHook, act, chance } from '@test/index'

import { useIsProfileSplashScreenPassed } from '../useProfileSplashScreens/useIsProfileSplashScreensPassed'

import { useProfileOrgAdminNominationSplashScreen } from './useProfileOrgAdminNominationSplashScreen'

vi.mock('@app/context/auth')
vi.mock('urql')
vi.mock('../useProfileSplashScreens/useIsProfileSplashScreensPassed')

const mockedUseAuth = vi.mocked(useAuth)
const mockedUseQuery = vi.mocked(useQuery)
const mockedUseMutation = vi.mocked(useMutation)
const mockedUseIsPassed = vi.mocked(useIsProfileSplashScreenPassed)

describe('useProfileOrgAdminNominationSplashScreen', () => {
  const profileId = chance.guid()

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.BOOKING_CONTACT,
      profile: {
        id: profileId,
        organizations: [{ id: chance.guid() }],
      },
    } as unknown as ReturnType<typeof useAuth>)

    mockedUseIsPassed.mockReturnValue(false)
    mockedUseQuery.mockReturnValue([
      { data: { organization_member: [] }, fetching: false, stale: false },
      vi.fn(),
    ])
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      vi.fn(),
    ])
  })

  it('returns disabled when not UK', () => {
    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => false },
      activeRole: RoleName.BOOKING_CONTACT,
      profile: { id: profileId, organizations: [{ id: chance.guid() }] },
    } as unknown as ReturnType<typeof useAuth>)

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    expect(result.current.isOrgAdminNominationSplashScreenEnabled).toBe(false)
  })

  it('returns disabled if splash screen already passed', () => {
    mockedUseIsPassed.mockReturnValue(true)

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    expect(result.current.isOrgAdminNominationSplashScreenEnabled).toBe(false)
  })

  it('returns disabled if no org has external_dashboard_url', () => {
    mockedUseQuery.mockReturnValue([
      {
        data: {
          organization_member: [
            { organization: { external_dashboard_url: null } },
          ],
        },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    expect(result.current.isOrgAdminNominationSplashScreenEnabled).toBe(false)
  })

  it('returns enabled if at least one org has external_dashboard_url', () => {
    mockedUseQuery.mockReturnValue([
      {
        data: {
          organization_member: [
            { organization: { external_dashboard_url: 'https://ext' } },
          ],
        },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    expect(result.current.isOrgAdminNominationSplashScreenEnabled).toBe(true)
  })

  it('calls insertSubmissionOfSplashScreen mutation with correct variables', async () => {
    const insertMutation = vi.fn().mockResolvedValue({})
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      insertMutation,
    ])

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    await act(async () => {
      await result.current.insertSubmissionOfOrgAdminNominationSplashScreen()
    })

    expect(insertMutation).toHaveBeenCalledWith({
      profileId,
      splashScreen: Splash_Screens_Enum.OrganisationAdminNomination,
    })
  })

  it('does not call mutation if profile id is missing', async () => {
    const insertMutation = vi.fn()
    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.BOOKING_CONTACT,
      profile: null,
    } as unknown as ReturnType<typeof useAuth>)
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      insertMutation,
    ])

    const { result } = renderHook(() =>
      useProfileOrgAdminNominationSplashScreen(),
    )

    await act(async () => {
      await result.current.insertSubmissionOfOrgAdminNominationSplashScreen()
    })

    expect(insertMutation).not.toHaveBeenCalled()
  })
})
