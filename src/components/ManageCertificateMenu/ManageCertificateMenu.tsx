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
        size="large"
        variant="outlined"
        color="secondary"
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        onClick={handleMenuButtonClick}
        sx={{
          borderColor: theme => theme.colors.navy[100],
          whiteSpace: 'nowrap',
        }}
        data-testid="manage-certification-button"
      >
        {t('manage-certificate')}
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
          <MenuItem
            data-testid="manage-certificate-modify-grade"
            onClick={onShowModifyGrade}
            disabled={isRevoked}
          >
            {t('modify-grade')}
          </MenuItem>
        )}
        {acl.canHoldCert() && (
          <MenuItem
            onClick={onShowPutOnHoldModal}
            disabled={isRevoked}
            data-testid="manage-certificate-hold-certificate"
          >
            {t('hold-certificate')}
          </MenuItem>
        )}

        {acl.isTTAdmin() && certificateChangeLength ? (
          <MenuItem
            data-testid="manage-certificate-change-log"
            onClick={onShowChangelogModal}
          >
            {t('change-log')}
          </MenuItem>
        ) : null}

        {acl.canRevokeCert() &&
          (isRevoked ? (
            <MenuItem
              data-testid="manage-certificate-undo-revoke"
              onClick={onShowUndoRevokeModal}
            >
              {t('undo-revoke')}
            </MenuItem>
          ) : (
            <MenuItem
              data-testid="manage-certificate-revoke-certificate"
              onClick={onShowRevokeModal}
            >
              {t('revoke-certificate')}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
