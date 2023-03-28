import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useState, useRef } from 'react'

import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

type Props = {
  isRevoked: boolean
  certificateChangeLength: number | undefined
  onShowModifyGrade: VoidFunction
  onShowRevokeModal: VoidFunction
  onShowUndoRevokeModal: VoidFunction
  onShowPutOnHoldModal: VoidFunction
  onShowChangelogModal: VoidFunction
}

export const ManageCertificateMenu: React.FC<Props> = ({
  isRevoked,
  certificateChangeLength,
  onShowModifyGrade,
  onShowRevokeModal,
  onShowUndoRevokeModal,
  onShowPutOnHoldModal,
  onShowChangelogModal,
}) => {
  const ref = useRef<(EventTarget & HTMLButtonElement) | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const { acl } = useAuth()

  const { t } = useScopedTranslation('common.course-certificate')

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
    <>
      <Button
        fullWidth
        data-testid="manage-certification-button"
        size="large"
        variant="outlined"
        color="secondary"
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        onClick={handleMenuButtonClick}
        sx={{
          borderColor: theme => theme.colors.navy[100],
          whiteSpace: 'nowrap',
        }}
      >
        {t('manage-certification')}
      </Button>
      <Menu
        id="certificate-action-menu"
        anchorEl={ref.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'lock-button', role: 'listbox' }}
        data-testid="manage-cert-menu"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        elevation={5}
        sx={{ mt: 2 }}
        PaperProps={{
          sx: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme => theme.colors.navy[100],
            width: `${ref.current?.getBoundingClientRect()?.width}px`,
          },
        }}
      >
        {acl.canOverrideGrades() && (
          <MenuItem onClick={onShowModifyGrade} disabled={isRevoked}>
            {t('modify-grade')}
          </MenuItem>
        )}
        {acl.canOverrideGrades() && (
          <MenuItem onClick={onShowPutOnHoldModal} disabled={isRevoked}>
            {t('hold-certificate')}
          </MenuItem>
        )}

        {acl.isTTAdmin() && certificateChangeLength ? (
          <MenuItem onClick={onShowChangelogModal}>{t('change-log')}</MenuItem>
        ) : null}

        {acl.canRevokeCert() &&
          (isRevoked ? (
            <MenuItem onClick={onShowUndoRevokeModal}>
              {t('undo-revoke')}
            </MenuItem>
          ) : (
            <MenuItem onClick={onShowRevokeModal}>{t('revoke-cert')}</MenuItem>
          ))}
      </Menu>
    </>
  )
}
