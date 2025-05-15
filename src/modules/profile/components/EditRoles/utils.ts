import { getI18n } from 'react-i18next'

import { TrainerRoleTypeName } from '@app/types'

export const getTrainerRoleLabels = (trainerRoles: TrainerRoleTypeName[]) => {
  const { t } = getI18n()

  return trainerRoles
    .map(trainerRole => {
      if (
        [TrainerRoleTypeName.AOL_ETA, TrainerRoleTypeName.TRAINER_ETA].includes(
          trainerRole,
        )
      )
        return t('trainer-role-types.eta')

      return t(`trainer-role-types.${trainerRole}`)
    })
    .join(', ')
}
