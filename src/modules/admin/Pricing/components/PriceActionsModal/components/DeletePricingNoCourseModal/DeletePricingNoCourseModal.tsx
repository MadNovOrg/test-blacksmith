import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'

export type DeletePricingNoCourseModalProps = {
  isOpen: boolean
  handleClose: () => void
}

export const DeletePricingNoCourseModal = ({
  isOpen,
  handleClose,
}: DeletePricingNoCourseModalProps) => {
  const { t } = useTranslation()
  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleCloseModal()}
      slots={{
        Title: () => (
          <Alert severity="warning">
            {t('pages.course-pricing.modal-impact-on-proceeding-with-delete')}
          </Alert>
        ),
      }}
      data-testid="delete-pricing-no-course-modal"
    />
  )
}
