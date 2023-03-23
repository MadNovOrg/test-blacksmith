import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  certificateChangeLength: number | undefined
  onShowModifyGrade: () => void
  onShowChangelogModal: () => void
  onShowPutOnHoldModal: () => void
}

export const ManageCertificateMenu: React.FC<Props> = ({
  certificateChangeLength,
  onShowModifyGrade,
  onShowChangelogModal,
  onShowPutOnHoldModal,
}) => {
  const ref = useRef<(EventTarget & HTMLButtonElement) | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const { t } = useTranslation()

  const handleClose = () => {
    ref.current = undefined
    setOpen(false)
  }

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ref.current = event.currentTarget
    setOpen(true)
  }

  return (
    <div>
      <Button
        fullWidth
        data-testid="manage-certification-button"
        size="large"
        variant="outlined"
        color="primary"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleMenuButtonClick}
      >
        {t('common.course-certificate.manage-certification')}
      </Button>
      <Menu
        id="certificate-action-menu"
        anchorEl={ref.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'lock-button', role: 'listbox' }}
        data-testid="create-course-options"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={onShowModifyGrade}>
          {t('common.course-certificate.modify-grade')}
        </MenuItem>
        <MenuItem onClick={onShowPutOnHoldModal}>
          {t('common.course-certificate.hold-certificate')}
        </MenuItem>
        <MenuItem>{t('common.course-certificate.revoke-certificate')}</MenuItem>
        {certificateChangeLength ? (
          <MenuItem onClick={onShowChangelogModal}>
            {t('common.course-certificate.revoke-certificate')}
          </MenuItem>
        ) : null}
      </Menu>
    </div>
  )
}
