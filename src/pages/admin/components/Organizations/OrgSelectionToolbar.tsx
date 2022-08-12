import { Box, Button, Menu, MenuItem } from '@mui/material'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import { sortBy } from 'lodash-es'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StyledSubNavLink } from '@app/components/StyledSubNavLink'
import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'

export const OrgSelectionToolbar: React.FC = () => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const { data } = useOrg(ALL_ORGS, profile?.id, acl.canViewAllOrganizations())

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const sorted = sortBy(data || [], org => org.name.toLowerCase())

  return (
    <Toolbar
      sx={{
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        bgcolor: 'white',
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box
          height={44}
          lineHeight={2}
          display="flex"
          justifyContent="left"
          px={3}
          color="secondary.dark"
          overflow="hidden"
        >
          <Link
            flex={1}
            component={StyledSubNavLink}
            to="/organizations/all"
            whiteSpace="nowrap"
          >
            {t('pages.org-details.all-organizations')}
          </Link>
          {sorted.map(org => (
            <Link
              key={org.id}
              flex={1}
              component={StyledSubNavLink}
              to={`/organizations/${org.id}`}
              whiteSpace="nowrap"
            >
              {org.name}
            </Link>
          ))}
        </Box>
        <Box>
          <Button onClick={event => setAnchorEl(event.currentTarget)}>
            More
          </Button>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            {sorted.map(org => (
              <MenuItem key={org.id} onClick={() => setAnchorEl(null)}>
                <Link
                  key={org.id}
                  component={StyledSubNavLink}
                  to={`/organizations/${org.id}`}
                >
                  {org.name}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Toolbar>
  )
}
