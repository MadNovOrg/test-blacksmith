import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course_Level_Enum,
  Grade_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { noop } from '@app/util'

interface Props {
  onChange?: (grade: Grade_Enum) => void
  courseLevel: Course_Level_Enum
  courseDeliveryType: Course_Delivery_Type_Enum
  initialValue?: Grade_Enum | undefined | null
}

type GradeOption = {
  key: Grade_Enum
  label: string
  icon: React.ReactNode
}

export const CourseGradingMenu: React.FC<React.PropsWithChildren<Props>> = ({
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
      key: Grade_Enum.Pass,
      icon: <CheckCircleIcon color="success" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-pass'),
    }

    const failOption: GradeOption = {
      key: Grade_Enum.Fail,
      icon: <CancelIcon color="error" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-fail'),
    }

    const observeOnlyOption: GradeOption = {
      key: Grade_Enum.ObserveOnly,
      icon: <CheckCircleIcon color="primary" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-non-physical'),
    }

    const assistOnlyOption: GradeOption = {
      key: Grade_Enum.AssistOnly,
      icon: <CheckCircleIcon color="primary" sx={{ mr: 1 }} />,
      label: t('pages.course-grading.grade-assist-only'),
    }

    if (
      (courseDeliveryType === Course_Delivery_Type_Enum.Virtual &&
        courseLevel === Course_Level_Enum.Level_1) ||
      courseDeliveryType === Course_Delivery_Type_Enum.Mixed
    ) {
      return [passOption, failOption]
    }

    if (
      courseDeliveryType === Course_Delivery_Type_Enum.F2F &&
      [
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.IntermediateTrainer,
      ].includes(courseLevel)
    ) {
      return [passOption, assistOnlyOption, failOption]
    }

    return [passOption, observeOnlyOption, failOption]
  }, [t, courseDeliveryType, courseLevel])

  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    initialValue ? options.findIndex(option => option.key === initialValue) : -1
  )

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: React.SetStateAction<number>,
    key: Grade_Enum
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
        {selectedIndex > -1 ? options[selectedIndex].icon : null}
        {selectedIndex > -1
          ? options[selectedIndex].label
          : t('pages.course-grading.grade-select')}
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
            data-testid={`modify-grade-${option.key}`}
            key={option.key}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index, option.key)}
            sx={{ minWidth: '200px' }}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
