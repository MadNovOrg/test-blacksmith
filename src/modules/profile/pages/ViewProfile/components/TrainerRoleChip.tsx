import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { getTrainerRoleChipColor } from '@app/modules/profile/utils'
import { TrainerRoleTypeName } from '@app/types'

export const TrainerRoleChip = ({
  trainerRole,
}: {
  trainerRole: TrainerRoleTypeName
}) => {
  const { t } = useTranslation()

  return (
    <Chip
      color={getTrainerRoleChipColor(trainerRole)}
      data-testid={`trainer-role-type-${trainerRole}`}
      label={t(`trainer-role-types.${trainerRole}`)}
      sx={{ marginRight: 1, marginBottom: 0.5 }}
    />
  )
}
