import { useFeatureFlagEnabled } from 'posthog-js/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useAuth } from '@app/context/auth'
import { Splash_Screens_Enum } from '@app/generated/graphql'

import { renderHook } from '@test/index'
import { chance } from '@test/index'

import { useIsProfileSplashScreenPassed } from './useIsProfileSplashScreensPassed'

vi.mock('@app/context/auth')
vi.mock('posthog-js/react')

describe('useIsProfileSplashScreenPassed', () => {
  const splashScreen = Splash_Screens_Enum.OrganisationsInsightReports

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true if profile is null', () => {
    vi.mocked(useAuth).mockReturnValue({ profile: undefined } as ReturnType<
      typeof useAuth
    >)
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(true)

    const { result } = renderHook(() =>
      useIsProfileSplashScreenPassed(splashScreen),
    )

    expect(result.current).toBeTruthy()
  })

  it('returns true if feature flag is disabled', () => {
    vi.mocked(useAuth).mockReturnValue({
      profile: { splashScreens: [] },
    } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(false)

    const { result } = renderHook(() =>
      useIsProfileSplashScreenPassed(splashScreen),
    )

    expect(result.current).toBe(true)
  })

  it('returns true if profile.splashScreens is missing', () => {
    vi.mocked(useAuth).mockReturnValue({ profile: {} } as unknown as ReturnType<
      typeof useAuth
    >)
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(true)

    const { result } = renderHook(() =>
      useIsProfileSplashScreenPassed(splashScreen),
    )

    expect(result.current).toBeTruthy()
  })

  it('returns the splash screen object if it exists', () => {
    const splashScreenObj = { id: chance.guid(), splash_screen: splashScreen }

    vi.mocked(useAuth).mockReturnValue({
      profile: { splashScreens: [splashScreenObj] },
    } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(true)

    const { result } = renderHook(() =>
      useIsProfileSplashScreenPassed(splashScreen),
    )

    expect(result.current).toBeTruthy()
  })

  it('returns undefined if splash screen does not exist in profile', () => {
    vi.mocked(useAuth).mockReturnValue({
      profile: { splashScreens: [] },
    } as unknown as ReturnType<typeof useAuth>)
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(true)

    const { result } = renderHook(() =>
      useIsProfileSplashScreenPassed(splashScreen),
    )

    expect(result.current).toBeFalsy()
  })
})
