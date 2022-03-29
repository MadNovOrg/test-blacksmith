import { renderHook } from '@testing-library/react-hooks'

import { useAuth, AuthProvider } from './index'

import { mockCognitoToProfile } from '@test/index'
import { RoleName } from '@app/types'

const render = () => {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

describe('context: Auth', () => {
  describe('useAuth', () => {
    it('returns expected shape', async () => {
      const { result, waitForNextUpdate } = render()
      await waitForNextUpdate()

      expect(Object.keys(result.current)).toStrictEqual([
        'token',
        'profile',
        'organizationIds',
        'defaultRole',
        'allowedRoles',
        'activeRole',
        'loading',
        'login',
        'logout',
        'changeRole',
        'acl',
      ])
    })

    it('maps allowed roles as expected', async () => {
      // Without roles
      mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': [] } })
      const render1 = render()
      await render1.waitForNextUpdate()
      expect(render1.result.current.allowedRoles).toEqual(new Set())

      // With roles
      const roles = [RoleName.USER, RoleName.TT_OPS]
      mockCognitoToProfile({ claims: { 'x-hasura-allowed-roles': roles } })
      const render2 = render()
      await render2.waitForNextUpdate()
      expect(render2.result.current.allowedRoles).toEqual(new Set(roles))
    })
  })
})
