import { Box, Button, Menu, MenuItem } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import { useState } from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

type ManageAffiliatedOrgsMenuProps = {
  disabled: boolean
  handleClick: () => void
}

export const ManageAffiliatedOrgsButton: React.FC<
  ManageAffiliatedOrgsMenuProps
> = ({ disabled, handleClick }) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.affiliated-orgs.remove-affiliate',
  )

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = () => {
    handleClick()
    handleClose()
  }
  return (
    <Box display="flex" alignItems="center">
      <Button
        variant="contained"
        {...{
          disabled: disabled,
          endIcon: <ArrowDropDownIcon />,
          size: 'large',
          sx: { width: '250px', height: '50px' },
        }}
        onClick={handleMenuButtonClick}
      >
        {t('label')}
      </Button>

      <Menu
        {...{
          MenuListProps: { 'aria-labelledby': 'lock-button', role: 'listbox' },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          transformOrigin: { vertical: 'top', horizontal: 'right' },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMenuItemClick}>{t('action-unlink')}</MenuItem>
      </Menu>
    </Box>
  )
}
