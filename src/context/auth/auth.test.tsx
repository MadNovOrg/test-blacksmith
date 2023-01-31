import { act, renderHook } from '@testing-library/react-hooks'
import { Auth } from 'aws-amplify'

import { RoleName } from '@app/types'

import {
  chance,
  defaultCognitoProfile,
  mockCognitoToProfile,
} from '@test/index'

import { ActiveRoles, lsActiveRoleClient } from './helpers'

import { AuthProvider, useAuth } from './index'

const render = () => {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

const lsKey = (id: string) => lsActiveRoleClient({ id }).key

describe('context: Auth', () => {
  it('returns expected shape', async () => {
    const { result, waitForNextUpdate } = render()

    const expectedKeys = [
      'loading',
      'login',
      'logout',
      'getJWT',
      'changeRole',
      'loadProfile',
      'reloadCurrentProfile',
      'acl',
    ]

    // On first render we haven't loaded the user yet
    expect(Object.keys(result.current)).toStrictEqual(expectedKeys)

    await waitForNextUpdate()

    // After auto-signin we should have the user data
    expect(Object.keys(result.current)).toStrictEqual([
      'profile',
      'isOrgAdmin',
      'organizationIds',
      'defaultRole',
      'allowedRoles',
      'activeRole',
      'verified',
      'loggedOut',
      ...expectedKeys,
    ])
  })

  it('stops loading if user is not logged in', async () => {
    const currentUserMock = jest.mocked(Auth.currentAuthenticatedUser)
    currentUserMock.mockRejectedValueOnce(undefined)

    const { result, waitForNextUpdate } = render()
    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBeUndefined()

    await waitForNextUpdate()
    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toBeUndefined()
  })

  it('sets user and profile data as expected', async () => {
    const { profile, claims } = defaultCognitoProfile
    const roles = claims ? claims['x-hasura-allowed-roles'] : []

    const { result, waitForNextUpdate } = render()

    expect(result.current.profile).toBeUndefined()
    expect(result.current.profile).toBeUndefined()

    await waitForNextUpdate()

    expect(result.current.profile).toStrictEqual(profile)
    expect(result.current.defaultRole).toBe(RoleName.USER)
    expect(result.current.activeRole).toBe(RoleName.USER)
    expect(result.current.allowedRoles).toStrictEqual(new Set(roles))
  })

  it('maps allowed roles as expected', async () => {
    // Without roles
    mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': [] } })
    const render1 = render()
    await render1.waitForNextUpdate()
    expect(render1.result.current.allowedRoles).toStrictEqual(new Set())

    // With roles
    const roles = chance.pickset([...ActiveRoles], 3)
    mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': roles } })
    const render2 = render()
    await render2.waitForNextUpdate()
    expect(render2.result.current.allowedRoles).toStrictEqual(new Set(roles))
  })

  it('stores activeRole in localStorage', async () => {
    const key = lsKey(defaultCognitoProfile.profile?.id ?? '')
    expect(localStorage.getItem(key)).toBeNull()

    const roles = [RoleName.USER, RoleName.TRAINER]
    mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': roles } })

    const { result, waitForNextUpdate } = render()
    await waitForNextUpdate()

    expect(result.current.activeRole).toBe(RoleName.USER)
    expect(localStorage.getItem(key)).toBe(result.current.activeRole)
  })

  it('gets activeRole from localStorage', async () => {
    const key = lsKey(defaultCognitoProfile.profile?.id ?? '')
    localStorage.setItem(key, RoleName.TRAINER)

    const roles = [RoleName.USER, RoleName.TRAINER]
    mockCognitoToProfile({
      claims: {
        'x-hasura-default-role': RoleName.USER,
        'x-hasura-allowed-roles': roles,
      },
    })

    const { result, waitForNextUpdate } = render()
    await waitForNextUpdate()

    expect(result.current.activeRole).toBe(RoleName.TRAINER)
    expect(localStorage.getItem(key)).toBe(result.current.activeRole)
  })

  it('parses organization ids as expected', async () => {
    const [id1, id2] = [chance.guid(), chance.guid()]
    mockCognitoToProfile({
      claims: { 'x-hasura-tt-organizations': `{"${id1}", "${id2}"}` },
    })

    const { result, waitForNextUpdate } = render()
    await waitForNextUpdate()

    expect(result.current.organizationIds).toStrictEqual([id1, id2])
  })

  describe('login', () => {
    it('logs in when inputs are valid', async () => {
      const [email, pass] = [chance.email(), chance.string()]

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()
      await act(result.current.logout)
      expect(result.current.profile).toBeUndefined()

      mockCognitoToProfile({ profile: { email } })
      await act(async () => {
        await result.current.login(email, pass)
      })

      expect(Auth.signIn).toHaveBeenCalledWith(email, pass)
      expect(result.current.profile?.email).toBe(email)
      expect(result.current.loggedOut).toBe(false)
    })

    it('returns error if Auth.signIn fails', async () => {
      const [email, pass] = [chance.email(), chance.string()]
      const signInMock = jest.mocked(Auth.signIn)
      signInMock.mockRejectedValueOnce(Error('Failed for tests'))
      const cognitoToProfileMock = mockCognitoToProfile({})

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()
      await act(result.current.logout)

      expect(cognitoToProfileMock).toHaveBeenCalledTimes(1)

      const resp = await result.current.login(email, pass)
      expect(resp).toStrictEqual({ error: Error('Failed for tests') })
      expect(cognitoToProfileMock).toHaveBeenCalledTimes(1) // not called again
    })

    it('returns error if profile GraphQL fails', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => null)

      const [email, pass] = [chance.email(), chance.string()]
      const cognitoToProfileMock = mockCognitoToProfile({})

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()
      await act(result.current.logout)

      expect(cognitoToProfileMock).toHaveBeenCalledTimes(1)

      cognitoToProfileMock.mockRejectedValueOnce(Error('Failed for tests'))

      await act(async () => {
        const resp = await result.current.login(email, pass)
        expect(resp).toStrictEqual({ user: undefined, error: undefined })
      })

      expect(cognitoToProfileMock).toHaveBeenCalledTimes(2)
      expect(console.error).toHaveBeenCalledWith(Error('Failed for tests'))
    })
  })

  describe('logout', () => {
    it('logs out of Cognito and erases state', async () => {
      const key = lsKey(defaultCognitoProfile.profile?.id ?? '')

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()

      expect(result.current.profile?.id).toBeTruthy()
      expect(result.current.activeRole).toBe(RoleName.USER)
      expect(localStorage.getItem(key)).toBe(RoleName.USER)

      await act(result.current.logout)

      expect(Auth.signOut).toHaveBeenCalledWith()
      expect(result.current.profile).toBeUndefined()
      expect(result.current.activeRole).toBeUndefined()
      expect(result.current.loggedOut).toBe(true)

      // ActiveRole is kept so that re-login picks up last role before logout
      expect(localStorage.getItem(key)).toBe(RoleName.USER)
    })
  })

  describe('changeRole', () => {
    it('does nothing if not logged in', async () => {
      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()

      await act(result.current.logout)

      expect(result.current.profile).toBeUndefined()
      expect(result.current.activeRole).toBeUndefined()

      const newRole = result.current.changeRole(RoleName.TRAINER)
      expect(newRole).toBeUndefined()
      expect(result.current.activeRole).toBeUndefined()
    })

    it('does nothing if role not in allowedRoles', async () => {
      const roles = [RoleName.USER, RoleName.TRAINER]
      mockCognitoToProfile({
        claims: {
          'x-hasura-default-role': RoleName.USER,
          'x-hasura-allowed-roles': roles,
        },
      })

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()

      const oldRole = result.current.activeRole
      expect(oldRole).toBe(RoleName.USER)

      const newRole = result.current.changeRole(RoleName.TT_ADMIN)

      expect(newRole).toBe(oldRole)
      expect(result.current.activeRole).toBe(oldRole)
    })

    it('updates activeRole when valid', async () => {
      const key = lsKey(defaultCognitoProfile.profile?.id ?? '')
      const roles = [RoleName.USER, RoleName.TRAINER]
      mockCognitoToProfile({
        claims: {
          'x-hasura-default-role': RoleName.USER,
          'x-hasura-allowed-roles': roles,
        },
      })

      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()

      expect(result.current.activeRole).toBe(RoleName.USER)
      expect(localStorage.getItem(key)).toBe(RoleName.USER)

      act(() => {
        const newRole = result.current.changeRole(RoleName.TRAINER)
        expect(newRole).toBe(RoleName.TRAINER)
      })

      expect(result.current.activeRole).toBe(RoleName.TRAINER)
      expect(localStorage.getItem(key)).toBe(RoleName.TRAINER)
    })
  })
})
