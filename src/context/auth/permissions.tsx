import type { ContextType as AuthContextType } from './index'

import { RoleName } from '@app/types'

type ACLInput = { profile: AuthContextType['profile']; acl?: ACL }

export type ACL = {
  isAdmin: () => boolean
  isTrainer: () => boolean
  canViewTrainerBase: () => boolean
}

export function injectACL<T extends ACLInput>(auth: T) {
  const roles = auth.profile?.roles ?? []
  const roleNames = new Set(roles.map(({ role }) => role.name))

  const acl = Object.freeze({
    isAdmin: () => roleNames.has(RoleName.ADMIN),

    isTrainer: () => roleNames.has(RoleName.TRAINER),

    canViewTrainerBase: () => acl.isTrainer(),
  })

  return { ...auth, acl }
}
