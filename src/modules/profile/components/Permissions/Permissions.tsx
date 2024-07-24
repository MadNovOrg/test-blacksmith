import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUpdateProfileAccess } from '../../hooks/useUpdateProfileAccess'
import { useUserAccessToKnowledgeHub } from '../../hooks/useUserAccessToKnowledgeHub'

type ProfilePermissionsProps = {
  canAccessKnowledgeHub: boolean
  profileId: string
}

export const ProfilePermissions = ({
  canAccessKnowledgeHub,
  profileId,
}: ProfilePermissionsProps) => {
  const { t } = useTranslation()

  const [checked, setChecked] = useState(canAccessKnowledgeHub)
  const [{ fetching }, updateProfileAccess] = useUpdateProfileAccess()

  const [{ data, fetching: loadingOrgsAccess }] =
    useUserAccessToKnowledgeHub(profileId)

  const accessHandleChange = useCallback(async () => {
    setChecked(prev => !prev)
    await updateProfileAccess({
      profileId,
      canAccessKnowledgeHub: !checked,
    })
  }, [checked, profileId, updateProfileAccess])

  if (!data || loadingOrgsAccess) return null

  return (
    <>
      <Typography variant="subtitle2" mt={3}>
        {t('pages.my-profile.permission')}
      </Typography>
      <Box
        bgcolor="common.white"
        borderRadius={1}
        mb={4}
        p={3}
        sx={{ mt: 1, overflowX: 'auto' }}
      >
        <FormControlLabel
          control={
            <Switch
              data-testid={'knowledge-hub-access-switch'}
              checked={checked}
              disabled={
                fetching || !data.organization_member_aggregate.aggregate?.count
              }
            />
          }
          label="Access to Knowledge Hub"
          onChange={accessHandleChange}
        />
        {!data.organization_member_aggregate.aggregate?.count ? (
          <Alert sx={{ my: 1 }} severity="warning" variant="outlined">
            {t('pages.my-profile.knowledge-hub-access-warning')}
          </Alert>
        ) : null}

        <Typography variant="body1" color="grey.700">
          {t('pages.my-profile.knowledge-hub-access-placeholder')}
        </Typography>
      </Box>
    </>
  )
}
