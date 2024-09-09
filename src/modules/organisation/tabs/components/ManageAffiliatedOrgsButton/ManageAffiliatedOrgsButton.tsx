import { Box, MenuItem } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { ButtonMenu } from '@app/modules/course_details/course_attendees_tab/components/ButtonMenu/ButtonMenu'

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

  return (
    <Box display="flex" alignItems="center">
      <ButtonMenu
        label={t('label')}
        buttonProps={{
          disabled: disabled,
          endIcon: <ArrowDropDownIcon />,
          size: 'large',
          sx: { width: '250px', height: '50px' },
        }}
      >
        <MenuItem onClick={handleClick}>{t('action-unlink')}</MenuItem>
      </ButtonMenu>
    </Box>
  )
}
