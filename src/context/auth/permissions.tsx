import type { ContextType as AuthContextType } from './index'

import { RoleName } from '@app/types'

type ACLInput = { profile: AuthContextType['profile']; acl?: ACL }

export type ACL = {
  isAdmin: () => boolean
  isTrainer: () => boolean
  canViewTrainerBase: () => boolean
}

export function injectACL<T extends ACLInput>(auth: T) {
  const allowedRoles = auth.profile?.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.ADMIN),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    canViewTrainerBase: () => acl.isTrainer(),
  })

  return { ...auth, acl }
}
