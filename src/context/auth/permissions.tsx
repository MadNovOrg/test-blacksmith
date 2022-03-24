import type { ACLInput } from './types'

import { RoleName } from '@app/types'

export function injectACL<T extends ACLInput>(auth: T) {
  const allowedRoles = auth.profile?.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.ADMIN),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    canViewTrainerBase: () => acl.isTrainer(),
  })

  return { ...auth, acl }
}
