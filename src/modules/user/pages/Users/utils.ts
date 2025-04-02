import { t } from 'i18next'

import { FilterOption } from '@app/components/FilterAccordion'
import { RoleName, TrainerRoleTypeName } from '@app/types'

export const getTrainerRoleTypesOptions = ({
  isAustralia,
}: {
  isAustralia: boolean
}) => {
  if (isAustralia) {
    return Object.values([
      TrainerRoleTypeName.PRINCIPAL,
      TrainerRoleTypeName.SENIOR,
      TrainerRoleTypeName.MODERATOR,
    ]).map<FilterOption>(type => ({
      id: type,
      title: t(`trainer-role-types.${type}`),
      selected: false,
    }))
  }
  return Object.values(TrainerRoleTypeName).map<FilterOption>(type => ({
    id: type,
    title: t(`trainer-role-types.${type}`),
    selected: false,
  }))
}

export const getRoleOptions = () => {
  const rolesToFilterBy = [
    ...Object.values([
      RoleName.USER,
      RoleName.TRAINER,
      RoleName.TT_OPS,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.SALES_ADMIN,
      RoleName.LD,
      RoleName.FINANCE,
      RoleName.TT_ADMIN,
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.UNVERIFIED,
    ]),
    'organization-admin',
  ]

  return rolesToFilterBy.map<FilterOption>(role => ({
    id: role,
    title: t(`role-names.${role}`),
    selected: false,
  }))
}
