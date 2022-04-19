import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, Menu, MenuItem } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { CourseType } from '@app/types'

const CREATE_COURSE_PATH = '/courses/new'

type Options = Array<{ key: CourseType; label: string }>

export const CreateCourseMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { acl } = useAuth()
  const { t } = useTranslation()

  const options: Options = useMemo(() => {
    return Object.values(CourseType).flatMap(type =>
      acl.canCreateCourse(type)
        ? [
            {
              key: type,
              label: t(
                `components.create-course-menu.${type.toLowerCase()}-course-label`
              ),
            },
          ]
        : []
    )
  }, [acl, t])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (options.length === 1) {
      return navigate(`${CREATE_COURSE_PATH}?type=${options[0].key}`)
    }

    setAnchorEl(event.currentTarget)
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleMenuButtonClick}
        data-testid="create-course-menu-button"
        endIcon={options.length > 1 ? <ArrowDropDownIcon /> : null}
      >
        {t('components.create-course-menu.button-text')}
      </Button>
      {options.length ? (
        <Menu
          id="course-type-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'lock-button', role: 'listbox' }}
          data-testid="create-course-options"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {options.map(option => (
            <MenuItem
              key={option.key}
              onClick={() =>
                navigate(`${CREATE_COURSE_PATH}?type=${option.key}`)
              }
              data-testid={`create-course-${option.key}`}
            >
              {option.label}
            </MenuItem>
          ))}

          <MenuItem disabled data-testid="bulk-import-option">
            {t('components.create-course-menu.bulk-import-label')}
          </MenuItem>
        </Menu>
      ) : null}
    </div>
  )
}
