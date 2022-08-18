import { RoleName } from '@app/types'

export function getRoleColor(name: string) {
  if (name === RoleName.TT_ADMIN || name === RoleName.TT_OPS) {
    return 'info'
  } else if (name === RoleName.USER || name === RoleName.TRAINER) {
    return 'success'
  } else {
    return 'default'
  }
}
