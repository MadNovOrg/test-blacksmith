import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseDeliveryType, CourseLevel, Grade } from '@app/types'
import { noop } from '@app/util'

interface Props {
  onChange?: (grade: Grade) => void
  courseLevel: CourseLevel
  courseDeliveryType: CourseDeliveryType
  initialValue?: Grade
}

type GradeOption = { key: Grade; label: string; icon: React.ReactNode }

export const CourseGradingMenu: React.FC<Props> = ({
  onChange = noop,
  courseDeliveryType,
  courseLevel,
  initialValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null)
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

  const options: GradeOption[] = useMemo(() => {
    const passOption: GradeOption = {
      key: Grade.PASS,
      icon: <CheckCircleIcon color="success" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-pass'),
    }

    const failOption: GradeOption = {
      key: Grade.FAIL,
      icon: <CancelIcon color="error" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-fail'),
    }

    const observeOnlyOption: GradeOption = {
      key: Grade.OBSERVE_ONLY,
      icon: <CheckCircleIcon color="primary" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-observe-only'),
    }

    const assistOnlyOption: GradeOption = {
      key: Grade.ASSIST_ONLY,
      icon: <CheckCircleIcon color="primary" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-assist-only'),
    }

    if (
      (courseDeliveryType === CourseDeliveryType.VIRTUAL &&
        courseLevel === CourseLevel.LEVEL_1) ||
      courseDeliveryType === CourseDeliveryType.MIXED
    ) {
      return [passOption, failOption]
    }

    if (
      courseDeliveryType === CourseDeliveryType.F2F &&
      [CourseLevel.ADVANCED_TRAINER, CourseLevel.INTERMEDIATE_TRAINER].includes(
        courseLevel
      )
    ) {
      return [passOption, assistOnlyOption, failOption]
    }

    return [passOption, observeOnlyOption, failOption]
  }, [t, courseDeliveryType, courseLevel])

  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    initialValue ? options.findIndex(option => option.key === initialValue) : 0
  )

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: React.SetStateAction<number>,
    key: Grade
  ) => {
    setSelectedIndex(index)
    setAnchorEl(null)

    onChange(key)
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
        data-testid="course-grading-menu-selected"
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
        data-testid="course-grading-options"
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.key}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index, option.key)}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
