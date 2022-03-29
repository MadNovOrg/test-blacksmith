import React, { useMemo, useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { CourseType } from '@app/types'

const CREATE_COURSE_PATH = '/trainer-base/course/new'

export const CreateCourseMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { acl } = useAuth()
  const { t } = useTranslation()

  const options: Array<{ key: CourseType; label: string }> = useMemo(() => {
    if (acl.isTTOps()) {
      const opts = [
        {
          key: CourseType.CLOSED,
          label: t('components.create-course-menu.closed-course-label'),
        },
        {
          key: CourseType.OPEN,
          label: t('components.create-course-menu.open-course-label'),
        },
      ]

      if (acl.isTTAdmin()) {
        opts.push({
          key: CourseType.INDIRECT,
          label: t('components.create-course-menu.indirect-course-label'),
        })
      }

      return opts
    }

    return []
  }, [acl, t])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (options.length) {
      setAnchorEl(event.currentTarget)
    } else {
      navigate(`${CREATE_COURSE_PATH}?type=INDIRECT`)
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleMenuButtonClick}
        data-testid="create-course-menu-button"
        endIcon={options.length ? <ArrowDropDownIcon /> : null}
      >
        {t('components.create-course-menu.button-text')}
      </Button>
      {options.length ? (
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
          data-testid="create-course-options"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {options.map(option => (
            <MenuItem
              key={option.key}
              onClick={() =>
                navigate(`${CREATE_COURSE_PATH}?type=${option.key}`)
              }
            >
              {option.label}
            </MenuItem>
          ))}
          <MenuItem disabled>
            {t('components.create-course-menu.bulk-import-label')}
          </MenuItem>
        </Menu>
      ) : null}
    </div>
  )
}
