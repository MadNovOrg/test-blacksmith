import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserAccessToKnowledgeHub } from '../../hooks/useUserAccessToKnowledgeHub'

type ProfilePermissionsProps = {
  onChange: (e: SyntheticEvent, checked: boolean) => void
  profileId: string
  checked: boolean
}

export const ProfilePermissions = ({
  profileId,
  checked,
  onChange,
}: ProfilePermissionsProps) => {
  const { t } = useTranslation()

  const [{ data, fetching: loadingOrgsAccess }] =
    useUserAccessToKnowledgeHub(profileId)

  if (!data || loadingOrgsAccess) return null

  return (
    <>
      <Typography variant="subtitle2" mt={3}>
        {t('pages.my-profile.permissions')}
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
              disabled={!data.organization_member_aggregate.aggregate?.count}
            />
          }
          label="Access to Knowledge Hub"
          onChange={onChange}
        />
        {!data.organization_member_aggregate.aggregate?.count ? (
          <Alert sx={{ my: 1 }} severity="warning" variant="outlined">
            {t('pages.my-profile.knowledge-hub-access-warning')}
          </Alert>
        ) : (
          <Typography variant="body1" color="grey.700">
            {t('pages.my-profile.knowledge-hub-access')}
          </Typography>
        )}
      </Box>
    </>
  )
}
