import { RoleName } from '@app/types'

export function getRoleColor(name: string) {
  if (name === RoleName.USER || name === RoleName.TRAINER) {
    return 'success'
  } else {
    return 'info'
  }
}
