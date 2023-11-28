import { Warning } from '@mui/icons-material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Box, Button, Menu, MenuItem, Tooltip } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

const CREATE_COURSE_PATH = '/courses/new'

type Options = Array<{ key: Course_Type_Enum; label: string }>

export const CreateCourseMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { acl } = useAuth()
  const { t } = useScopedTranslation('components.create-course-menu')

  const options: Options = useMemo(() => {
    return Object.values(Course_Type_Enum).flatMap(type =>
      acl.canCreateCourse(type)
        ? [
            {
              key: type,
              label: t(`${type.toLowerCase()}-course-label`),
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

  const canCreateSomeCourseLevel = acl.canCreateSomeCourseLevel()

  return (
    <Box display="flex" alignItems="center">
      <Button
        variant="contained"
        onClick={handleMenuButtonClick}
        data-testid="create-course-menu-button"
        endIcon={options.length > 1 ? <ArrowDropDownIcon /> : null}
        disabled={!canCreateSomeCourseLevel}
      >
        {t('button-text')}
      </Button>
      {!canCreateSomeCourseLevel ? (
        <Tooltip title={t('tooltip-text')}>
          <Warning color="warning" sx={{ ml: 1 }} />
        </Tooltip>
      ) : null}

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
        </Menu>
      ) : null}
    </Box>
  )
}
