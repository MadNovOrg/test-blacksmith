import { Chip, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import {
  GetBulkProfilesRolesByProfileIdQuery,
  Trainer_Agreement_Type_Enum,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

interface IUserRoleProps {
  agreementTypes?: Trainer_Agreement_Type_Enum[]
  isOrganisationAdmin: boolean
  user: GetBulkProfilesRolesByProfileIdQuery['profile'][0]['roles']
}

const UserRole: React.FC<IUserRoleProps> = ({
  agreementTypes,
  isOrganisationAdmin,
  user,
}) => {
  const { t } = useTranslation()
  const isExternalRole = (role: string) =>
    [RoleName.TRAINER, RoleName.USER].some(r => r === role)

  const userRoles = user

  return (
    <Box display="flex" flexWrap="wrap">
      {userRoles.map(({ role }) => {
        return (
          <Chip
            key={role.name}
            sx={{
              fontSize: '12px',
              margin: '0 4px 4px 0',
            }}
            size="small"
            color={isExternalRole(role.name) ? 'success' : 'info'}
            label={t(`role-names.${role.name}`)}
            data-testid="user-role-chip"
          />
        )
      })}

      {isOrganisationAdmin && (
        <Chip
          sx={{
            fontSize: '12px',
            margin: '0 4px 4px 0',
          }}
          size="small"
          color="info"
          label={t(`role-names.organization-admin`)}
          data-testid="user-role-chip"
        />
      )}

      {agreementTypes?.map(agreementType => (
        <Chip
          color="gray"
          data-testid={`user-agreement-type-chip-${agreementType}`}
          key={agreementType}
          label={t(`trainer-agreement-types.${agreementType}`)}
          size="small"
          sx={{ fontSize: '12px', margin: '0 4px 4px 0' }}
        />
      ))}
    </Box>
  )
}

export default UserRole
