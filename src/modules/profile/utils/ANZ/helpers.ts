import { RoleName, TrainerRoleTypeName } from '@app/types'

enum RoleColor {
  SUCCESS = 'success',
  INFO = 'info',
}

export function getRoleColor(name: string) {
  return name === RoleName.USER || name === RoleName.TRAINER
    ? RoleColor.SUCCESS
    : RoleColor.INFO
}

export enum DietaryRestrictionRadioValues {
  NO = 'NO',
  YES = 'YES',
}
export enum DisabilitiesRadioValues {
  NO = 'NO',
  YES = 'YES',
  RATHER_NOT_SAY = 'RATHER_NOT_SAY',
}

export type OrgMemberType = {
  id: string
  organization: { name: string }
}

export const avatarSize = 220
export const maxAvatarFileSizeBytes = Number.parseInt(
  import.meta.env.VITE_PROFILE_AVATAR_MAX_SIZE_BYTES ?? 0,
)

export type UserRoleName = RoleName | 'tt-employee'

export type EmployeeRoleName = RoleName | 'sales'

export const userRolesNames: UserRoleName[] = [
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  'tt-employee',
]

export const employeeRolesNames: EmployeeRoleName[] = [
  RoleName.TT_OPS,
  RoleName.FINANCE,
  RoleName.LD,
  'sales',
]

export const salesRolesNames: RoleName[] = [
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
]

export const employeeRole = {
  id: '0',
  name: 'tt-employee' as RoleName,
}
export const salesRole = {
  id: '1',
  name: 'sales' as RoleName,
}

export const defaultTrainerRoles = {
  trainerRole: [] as string[],
  moderatorRole: false,
}

export const trainerRolesNames: TrainerRoleTypeName[] = [
  TrainerRoleTypeName.PRINCIPAL,
  TrainerRoleTypeName.SENIOR,
]

export const userSubRoles: RoleName[] = [
  RoleName.BOOKING_CONTACT,
  RoleName.ORGANIZATION_KEY_CONTACT,
]
