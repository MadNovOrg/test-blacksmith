import { Chip, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { GetProfilesQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

interface IUserRoleProps {
  user: GetProfilesQuery['profiles'][0]
}

const UserRole: React.FC<IUserRoleProps> = ({ user }) => {
  const { t } = useTranslation()
  const isExternalRole = (role: string) =>
    [RoleName.TRAINER, RoleName.USER].some(r => r === role)

  const isOrganisationAdmin = user.organizations.some(
    organisation => organisation.isAdmin
  )

  return (
    <Box display="flex" flexWrap="wrap">
      {user.roles.map(userRoles => {
        return (
          <Chip
            key={userRoles.role.id}
            sx={{
              fontSize: '12px',
              margin: '0 4px 4px 0',
            }}
            size="small"
            color={isExternalRole(userRoles.role.name) ? 'success' : 'info'}
            label={t(`role-names.${userRoles.role.name}`)}
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
