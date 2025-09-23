import { RoleName } from '@app/types'

export function generateRolesUpTo(role: RoleName): Set<RoleName> {
  const roles = new Set<RoleName>()

  for (const roleName of Object.values(RoleName)) {
    roles.add(roleName)

    if (roleName === role) {
      return roles
    }
  }

  return roles
}
