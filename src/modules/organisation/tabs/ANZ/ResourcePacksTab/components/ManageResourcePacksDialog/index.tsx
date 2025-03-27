import { Typography } from '@mui/material'

import { Dialog } from '@app/components/dialogs'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { ManageResourcePacksForm } from '../ManageResourcePacksForm'

type ManageResourcePacksDialogProps = {
  onClose: () => void
  onFormSubmitSuccess: () => void
  open: boolean
  orgId: string
}

export const ManageResourcePacksDialog = ({
  onClose,
  onFormSubmitSuccess,
  open,
  orgId,
}: ManageResourcePacksDialogProps) => {
  const { t } = useScopedTranslation('pages.org-details.tabs.resource-packs')

  return (
    <Dialog
      maxWidth={600}
      onClose={onClose}
      open={open}
      slots={{
        Title: () => (
          <Typography variant="h6">{t('manage-modal-title')}</Typography>
        ),
        Subtitle: () => (
          <Typography variant="body2" mt={1}>
            {t('manage-modal-subtitle')}
          </Typography>
        ),
      }}
    >
      <ManageResourcePacksForm
        onCancel={onClose}
        orgId={orgId}
        onSuccess={onFormSubmitSuccess}
      />
    </Dialog>
  )
}
