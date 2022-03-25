import { MarkOptional } from 'ts-essentials'

import type { AuthContextType } from './types'

import { RoleName } from '@app/types'

export function injectACL(auth: MarkOptional<AuthContextType, 'acl'>) {
  const allowedRoles = auth.allowedRoles ?? new Set()

  const acl = Object.freeze({
    isAdmin: () => allowedRoles.has(RoleName.ADMIN),

    isTrainer: () => allowedRoles.has(RoleName.TRAINER),

    canViewTrainerBase: () => acl.isTrainer(),
  })

  return { ...auth, acl }
}
