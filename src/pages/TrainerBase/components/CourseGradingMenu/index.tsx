import React, { useMemo } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export const CourseGradingMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

  const options: Array<{ label: string; icon: React.ReactNode }> = useMemo(
    () => [
      {
        icon: <CheckCircleIcon color="success" sx={{ mr: 1 }} />,
        label: t('pages.course-grading.grade-pass'),
      },
      {
        icon: <CheckCircleIcon color="primary" sx={{ mr: 1 }} />,
        label: t('pages.course-grading.grade-observe-only'),
      },
      {
        icon: <CancelIcon color="error" sx={{ mr: 1 }} />,
        label: t('pages.course-grading.grade-fail'),
      },
    ],
    [t]
  )

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: React.SetStateAction<number>
  ) => {
    setSelectedIndex(index)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Typography
        onClick={event => setAnchorEl(event.currentTarget)}
        display="flex"
        sx={{ cursor: 'pointer' }}
      >
        {options[selectedIndex].icon}
        {options[selectedIndex].label}
        <ArrowDropDownIcon sx={{ ml: 1 }} />
      </Typography>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.label}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
