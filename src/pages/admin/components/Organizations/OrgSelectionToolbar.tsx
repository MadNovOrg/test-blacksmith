import { Box } from '@mui/material'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { StyledSubNavLink } from '@app/components/StyledSubNavLink'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'

export const OrgSelectionToolbar: React.FC = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { data } = useOrg(undefined, profile?.id)

  return (
    <Toolbar
      sx={{
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        bgcolor: 'white',
      }}
    >
      <Box
        flex={1}
        height={44}
        lineHeight={2}
        display="flex"
        justifyContent="left"
        px={3}
        color="secondary.dark"
      >
        <Link component={StyledSubNavLink} to="/organizations/all">
          {t('pages.org-details.all-organizations')}
        </Link>
        {(data || []).map(org => (
          <Link
            key={org.id}
            component={StyledSubNavLink}
            to={`/organizations/${org.id}`}
          >
            {org.name}
          </Link>
        ))}
      </Box>
    </Toolbar>
  )
}
