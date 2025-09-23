import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { LoadingButton } from '@mui/lab'
import {
  Grid,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { GetProfileDetailsQuery } from '@app/generated/graphql'

import {
  EditProfileInputs,
  navigateBackPath,
} from '../../pages/EditProfile/utils'
import { InviteUserToOrganisation as InviteUserToAnzOrganisation } from '../InviteUserToOrganisation/ANZ'
import { InviteUserToOrganisation as InviteUserToUkOrganisation } from '../InviteUserToOrganisation/UK'
import { UploadAvatar } from '../UploadAvatar/UploadAvatar'

const InviteUserToOrganisation: FC<{
  userProfile: GetProfileDetailsQuery['profile']
  onClose: () => void
}> = ({ userProfile, onClose }) => {
  const {
    acl: { isAustralia },
  } = useAuth()
  if (!userProfile) return null
  if (isAustralia())
    return (
      <InviteUserToAnzOrganisation
        userProfile={userProfile}
        onClose={onClose}
      />
    )
  return (
    <InviteUserToUkOrganisation userProfile={userProfile} onClose={onClose} />
  )
}

type Props = {
  profile: GetProfileDetailsQuery['profile']
  loading: boolean
}
export const UploadAvatarAndCTAButtons: FC<Props> = ({ profile, loading }) => {
  const [showInviteOrgModal, setShowInviteOrgModal] = useState(false)

  const theme = useTheme()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [searchParams] = useSearchParams()
  const {
    acl: { canInviteToOrganizations },
  } = useAuth()
  const navigate = useNavigate()

  const orgId = searchParams.get('orgId')
  const { setValue, watch } = useFormContext<EditProfileInputs>()
  const values = watch()
  if (!profile) return null
  return (
    <Grid item md={4} display="flex" flexDirection="column" alignItems="center">
      <UploadAvatar setValue={setValue} values={values} loading={loading} />
      <Typography
        variant="h1"
        whiteSpace="nowrap"
        sx={{
          maxWidth: '240px',
          overflowWrap: 'break-word',
          whiteSpace: 'initial',
        }}
      >
        {profile.fullName}
      </Typography>
      <Typography variant="body1" color="grey.700">
        {profile.email}
      </Typography>
      <Box mt={2}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth={isMobile}
          onClick={() => navigate(navigateBackPath(orgId), { replace: true })}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          fullWidth={isMobile}
          color="primary"
          sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 2 : 0 }}
          type="submit"
          loading={loading}
          data-testid="save-changes-button"
        >
          {t('save-changes')}
        </LoadingButton>
      </Box>
      <Box m={2}>
        {canInviteToOrganizations() && !profile.archived ? (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowInviteOrgModal?.(true)}
            data-testid="edit-invite-user-to-org"
          >
            {t(
              'pages.org-details.tabs.users.invite-individual-to-organization',
            )}
          </Button>
        ) : undefined}
      </Box>
      <Dialog
        open={showInviteOrgModal}
        onClose={() => setShowInviteOrgModal(false)}
        slots={{
          Title: () => <>{t('pages.invite-to-org.title')}</>,
        }}
        maxWidth={600}
        minWidth={400}
      >
        <InviteUserToOrganisation
          userProfile={profile}
          onClose={() => setShowInviteOrgModal(false)}
        />
      </Dialog>
    </Grid>
  )
}
