import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useQuery, useMutation } from 'urql'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useAuth } from '@app/context/auth'
import { Splash_Screens_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { act, renderHook } from '@test/index'

import { useIsProfileSplashScreenPassed } from '../useProfileSplashScreens/useIsProfileSplashScreensPassed'

import { useProfileInsightsReportSplashScreen } from './useProfileInsightsReportSplashScreen'

vi.mock('@app/context/auth')
vi.mock('posthog-js/react')
vi.mock('../useProfileSplashScreens/useIsProfileSplashScreensPassed')
vi.mock('urql')

const mockedUseAuth = vi.mocked(useAuth)
const mockedUseFeatureFlagEnabled = vi.mocked(useFeatureFlagEnabled)
const mockedUseIsProfileSplashScreenPassed = vi.mocked(
  useIsProfileSplashScreenPassed,
)
const mockedUseQuery = vi.mocked(useQuery)
const mockedUseMutation = vi.mocked(useMutation)

describe('useProfileInsightsReportSplashScreen', () => {
  const profileId = 'profile-123'
  const managedOrg = {
    organization: {
      id: 'org-1',
      external_dashboard_url: 'https://url',
      name: 'Org 1',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array if splash screen is passed', () => {
    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.USER,
      managedOrgIds: ['org-1'],
      profile: { id: profileId },
      reloadCurrentProfile: vi.fn(),
    } as unknown as ReturnType<typeof useAuth>)

    mockedUseFeatureFlagEnabled.mockReturnValue(true)
    mockedUseIsProfileSplashScreenPassed.mockReturnValue(true)
    mockedUseQuery.mockReturnValue([
      {
        data: { organization_member: [managedOrg] },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      vi.fn(),
    ])

    const { result } = renderHook(() => useProfileInsightsReportSplashScreen())

    expect(result.current.managedOrgsWithDashboardUrls).toEqual([])
  })

  it('returns managed orgs with dashboard urls if enabled and splash not passed', () => {
    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.USER,
      managedOrgIds: ['org-1'],
      profile: { id: profileId },
      reloadCurrentProfile: vi.fn(),
    } as unknown as ReturnType<typeof useAuth>)

    mockedUseFeatureFlagEnabled.mockReturnValue(true)
    mockedUseIsProfileSplashScreenPassed.mockReturnValue(false)
    mockedUseQuery.mockReturnValue([
      {
        data: { organization_member: [managedOrg] },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      vi.fn(),
    ])

    const { result } = renderHook(() => useProfileInsightsReportSplashScreen())

    expect(result.current.managedOrgsWithDashboardUrls).toEqual([
      {
        orgId: 'org-1',
        externalDashboardUrl: 'https://url',
        name: 'Org 1',
      },
    ])
  })

  it('insertSubmissionOfInsightsReportSplashScreen calls mutation and reloads profile', async () => {
    const reloadCurrentProfile = vi.fn()
    const insertMutation = vi.fn().mockResolvedValue({})

    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.USER,
      managedOrgIds: ['org-1'],
      profile: { id: profileId },
      reloadCurrentProfile,
    } as unknown as ReturnType<typeof useAuth>)

    mockedUseFeatureFlagEnabled.mockReturnValue(true)
    mockedUseIsProfileSplashScreenPassed.mockReturnValue(false)
    mockedUseQuery.mockReturnValue([
      {
        data: { organization_member: [managedOrg] },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      insertMutation,
    ])

    const { result } = renderHook(() => useProfileInsightsReportSplashScreen())

    await act(async () => {
      await result.current.insertSubmissionOfInsightsReportSplashScreen()
    })

    expect(insertMutation).toHaveBeenCalledWith({
      profileId,
      splashScreen: Splash_Screens_Enum.OrganisationsInsightReports,
    })
    expect(reloadCurrentProfile).toHaveBeenCalled()
  })

  it('does not call mutation if profile id is missing', async () => {
    const insertMutation = vi.fn()
    const reloadCurrentProfile = vi.fn()

    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
      activeRole: RoleName.USER,
      managedOrgIds: ['org-1'],
      profile: null,
      reloadCurrentProfile,
    } as unknown as ReturnType<typeof useAuth>)

    mockedUseFeatureFlagEnabled.mockReturnValue(true)
    mockedUseIsProfileSplashScreenPassed.mockReturnValue(false)
    mockedUseMutation.mockReturnValue([
      { fetching: false, stale: false },
      insertMutation,
    ])

    const { result } = renderHook(() => useProfileInsightsReportSplashScreen())

    await act(async () => {
      await result.current.insertSubmissionOfInsightsReportSplashScreen()
    })

    expect(insertMutation).not.toHaveBeenCalled()
    expect(reloadCurrentProfile).not.toHaveBeenCalled()
  })
})
