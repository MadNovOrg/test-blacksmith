import { Box, Button, Typography } from '@mui/material'

import { Dialog } from '@app/components/dialogs'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useUnlinkMultipleAffiliatedOrganisations } from '@app/modules/organisation/hooks/useUnlinkMultiplAffiliatedOrganisations'

export type RemoveAffiliatedOrgModalProps = {
  affiliatedOrgsIds?: (string | number)[]
  onClose: () => void
  onSave: () => void
}

export const RemoveAffiliatedOrgModal = ({
  affiliatedOrgsIds,
  onClose,
  onSave,
}: RemoveAffiliatedOrgModalProps) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.affiliated-orgs.remove-affiliate',
  )
  const [, unlinkMultipleAffiliatedOrganisations] =
    useUnlinkMultipleAffiliatedOrganisations()

  const onSubmit = async () => {
    await unlinkMultipleAffiliatedOrganisations({
      affiliatedOrgsIds: affiliatedOrgsIds,
    })
    onSave()
  }

  return (
    <Dialog
      open
      onClose={onClose}
      minWidth={600}
      data-testid="remove-affiliated-org-modal"
      slots={{
        Title: () => (
          <Typography variant="h4" fontWeight={600}>
            {t('title')}
          </Typography>
        ),
      }}
    >
      <Typography sx={{ padding: '10px 0px' }}>{t('description')}</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        <Button
          data-testid="close-unlink-affiliate-org-button"
          type="button"
          onClick={onClose}
        >
          {t('close-button')}
        </Button>
        <Button
          data-testid="confirm-unlink-affiliate-org-button"
          onClick={onSubmit}
          type="button"
          color="primary"
          variant="contained"
        >
          {t('confirm-button')}
        </Button>
      </Box>
    </Dialog>
  )
}
