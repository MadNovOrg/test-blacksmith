import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import {
  useOrganisationPermissions,
  useUpdateOrganisationPermissions,
} from '../../hooks/useOrganisationPermissions'

type OrgPermissionsTabProps = {
  orgId: string
}

export const OrgPermissionsTab = ({ orgId }: OrgPermissionsTabProps) => {
  const { t } = useScopedTranslation('pages.org-details.tabs.permissions')
  const { width } = useWindowSize()

  const isMobile = width <= 425

  const [{ data, fetching, error }] = useOrganisationPermissions(orgId)
  const [{ fetching: updating }, updatePermissions] =
    useUpdateOrganisationPermissions()

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (data?.organization_by_pk?.canAccessKnowledgeHub) {
      setChecked(true)
    }
  }, [data?.organization_by_pk?.canAccessKnowledgeHub])

  const accessHandleChange = useCallback(async () => {
    setChecked(prev => !prev)
    await updatePermissions({
      orgId,
      canAccessKnowledgeHub: !checked,
    })
  }, [checked, orgId, updatePermissions])

  if (fetching)
    return (
      <Box sx={{ pt: 2, pb: 4 }}>
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-users-fetching"
        >
          <CircularProgress />
        </Stack>
      </Box>
    )

  return data && !error ? (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Box>
        <Typography
          variant="subtitle1"
          mb={2}
          data-testid="org-permissions-title"
        >
          Knowledge Hub
        </Typography>
      </Box>

      <Box bgcolor="common.white" borderRadius={1} mb={4} p={isMobile ? 1 : 3}>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              disabled={updating}
              data-testid={'org-knowledge-hub-access-switch'}
            />
          }
          label="Access to Knowledge Hub"
          onChange={accessHandleChange}
        />
        <Typography variant="body1" color="grey.700">
          {t('knowledge-hub-access')}
        </Typography>
      </Box>
    </Box>
  ) : null
}
