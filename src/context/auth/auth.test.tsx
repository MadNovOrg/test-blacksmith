import { Auth } from 'aws-amplify'
import { renderHook } from '@testing-library/react-hooks'

import { ActiveRoles } from './helpers'

import { useAuth, AuthProvider } from './index'

import {
  mockCognitoToProfile,
  defaultCognitoProfile,
  chance,
} from '@test/index'
import { RoleName } from '@app/types'

const render = () => {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

describe('context: Auth', () => {
  it('returns expected shape', async () => {
    const { result, waitForNextUpdate } = render()

    const expectedKeys = ['loading', 'login', 'logout', 'changeRole', 'acl']

    // On first render we haven't loaded the user yet
    expect(Object.keys(result.current)).toStrictEqual(expectedKeys)

    await waitForNextUpdate()

    // After auto-signin we should have the user data
    expect(Object.keys(result.current)).toStrictEqual([
      'token',
      'profile',
      'organizationIds',
      'defaultRole',
      'allowedRoles',
      'activeRole',
      ...expectedKeys,
    ])
  })

  it('stops loading if user is not logged in', async () => {
    const currentUserMock = jest.mocked(Auth.currentAuthenticatedUser)
    currentUserMock.mockRejectedValueOnce(undefined)

    const { result, waitForNextUpdate } = render()
    expect(result.current.loading).toBe(true)
    expect(result.current.token).toBeUndefined()

    await waitForNextUpdate()
    expect(result.current.loading).toBe(false)
    expect(result.current.token).toBeUndefined()
  })

  it('sets user and profile data as expected', async () => {
    const { token, profile, claims } = defaultCognitoProfile
    const roles = claims['x-hasura-allowed-roles']

    const { result, waitForNextUpdate } = render()

    expect(result.current.token).toBeUndefined()
    expect(result.current.profile).toBeUndefined()

    await waitForNextUpdate()

    expect(result.current.token).toBe(token)
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
    const lsSet = jest.spyOn(window.localStorage.__proto__, 'setItem')
    const roles = [RoleName.USER, RoleName.TRAINER]
    mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': roles } })

    const { result, waitForNextUpdate } = render()
    await waitForNextUpdate()

    expect(result.current.activeRole).toBe(RoleName.USER)
    const key = `auth-active-role-${defaultCognitoProfile.profile?.id}`
    expect(lsSet).toBeCalledWith(key, RoleName.USER)
  })

  it('gets activeRole from localStorage', async () => {
    const key = `auth-active-role-${defaultCognitoProfile.profile?.id}`
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
  })
})
