import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Container,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

export enum TableMenuSelections {
  PERSONAL_DETAILS = 0,
  ORG_DETAILS,
  COURSE_ATTENDEE,
  COURSE_TRAINER,
  CERTIFICATIONS,
}

type TableMenuProps = {
  selectedTab: TableMenuSelections
  setSelectedTab: (selectedTab: TableMenuSelections) => void
}

export const TableMenu: React.FC<TableMenuProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const { t } = useTranslation()
  const { acl } = useAuth()

  const onActionsClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const onClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const courseHistory = useMemo(() => {
    return !acl.canViewCourseHistory()
      ? [
          {
            label: t('course-as-trainer'),
            value: '4',
          },
        ]
      : []
  }, [acl, t])

  const actions = useMemo(() => {
    return [
      {
        label: t('personal-details'),
        value: TableMenuSelections.PERSONAL_DETAILS,
      },
      {
        label: t('org-details'),
        value: TableMenuSelections.ORG_DETAILS,
      },
      {
        label: t('course-as-attendee'),
        value: TableMenuSelections.COURSE_ATTENDEE,
      },
      {
        label: t('course-as-trainer'),
        value: TableMenuSelections.COURSE_TRAINER,
      },
      {
        label: t('certifications'),
        value: TableMenuSelections.CERTIFICATIONS,
      },
      ...courseHistory,
    ]
  }, [courseHistory, t])

  const dimensions = window.innerWidth * 0.8

  return (
    <Container disableGutters sx={{ mt: 2 }}>
      <Button
        onClick={onActionsClick}
        variant="outlined"
        fullWidth
        sx={{
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        <Typography
          variant="body1"
          color="primary"
          fontWeight={500}
          textAlign="left"
        >
          {actions.find(el => el.value === selectedTab)?.label}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        sx={{ width: dimensions }}
      >
        {actions.map(action => (
          <MenuItem
            key={action.label}
            onClick={() => {
              setSelectedTab(action.value as TableMenuSelections)
              onClose()
            }}
          >
            <ListItemText sx={{ width: dimensions }}>
              <Typography variant="body1" color="primary" fontWeight={500}>
                {action.label}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Container>
  )
}
