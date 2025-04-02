import { Chip, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { GetBulkProfilesRolesByProfileIdQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

interface IUserRoleProps {
  user: GetBulkProfilesRolesByProfileIdQuery['profile'][0]['roles']
  isOrganisationAdmin: boolean
}

const UserRole: React.FC<IUserRoleProps> = ({ user, isOrganisationAdmin }) => {
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
    </Box>
  )
}

export default UserRole
