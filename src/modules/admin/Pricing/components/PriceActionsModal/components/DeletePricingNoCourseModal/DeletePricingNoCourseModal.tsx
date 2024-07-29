import { Alert, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'

export type DeletePricingNoCourseModalProps = {
  isOpen: boolean
  handleApprove: () => void
  handleCancel: () => void
}

export const DeletePricingNoCourseModal = ({
  isOpen,
  handleApprove,
  handleCancel,
}: DeletePricingNoCourseModalProps) => {
  const { t } = useTranslation()
  const approveDeleteModal = () => {
    handleApprove()
  }

  const cancelDeleteModal = () => {
    handleCancel()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => cancelDeleteModal()}
      slots={{
        Title: () => (
          <Alert severity="warning">
            {t('pages.course-pricing.modal-impact-on-proceeding-with-delete')}
          </Alert>
        ),
      }}
      data-testid="delete-pricing-no-course-modal"
    >
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => approveDeleteModal()}
          data-testid="approve-delete-course-pricing"
        >
          {t('approve')}
        </Button>
        <Button
          onClick={() => cancelDeleteModal()}
          data-testid="cancel-delete-course-pricing"
        >
          {t('cancel')}
        </Button>
      </Box>
    </Dialog>
  )
}
